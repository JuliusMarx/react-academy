import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { afterNextRender, effect, inject, InjectionToken, PLATFORM_ID, Service, signal } from '@angular/core';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { BrowserStorage } from './browser-storage';
import { mergeProgress } from './progress-merge';
import { normalizeProgress, Progress, ProgressService } from './progress.service';
import { SITE } from './site';

/** Supabase project URL and publishable key; empty values switch the account feature off. */
export const CLOUD_CONFIG = new InjectionToken<{ url: string; key: string }>('CLOUD_CONFIG', {
  factory: () => SITE.cloud,
});

/** Creates the Supabase client. Loaded on demand, so visitors without an account never download it. */
export const CLOUD_CLIENT = new InjectionToken<() => Promise<SupabaseClient>>('CLOUD_CLIENT', {
  factory: () => {
    const { url, key } = inject(CLOUD_CONFIG);
    return () =>
      import('@supabase/supabase-js').then(({ createClient }) =>
        createClient(url, key, {
          auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true, storageKey: AUTH_KEY },
        }),
      );
  },
});

/** Row in the Supabase table "progress": one per user and Academy (see docs/cloud-setup.md). */
interface ProgressRow {
  data: unknown;
  updated_at: string;
}

/** What this browser knows about the synced state, kept in localStorage. */
interface SyncMeta {
  userId: string;
  /** updated_at of the cloud row the local progress builds on. */
  base?: string;
  /** Local changes that aren't in the cloud yet (e.g. made offline). */
  dirty: boolean;
}

export type SyncStatus = 'signed-out' | 'syncing' | 'saved' | 'error';

const AUTH_KEY = `${SITE.storagePrefix}.auth`;
const META_KEY = `${SITE.storagePrefix}.cloud`;
const PUSH_DELAY = 2000;
/** Pull again when the tab comes back, at most this often. */
const PULL_INTERVAL = 30_000;

/**
 * Optional account (GitHub login via Supabase) that keeps the progress in the cloud. Local progress
 * stays the source of truth for the UI; this service uploads changes and brings in changes from other
 * devices. Without SITE.cloud configured it does nothing.
 */
@Service()
export class CloudService {
  private readonly progress = inject(ProgressService);
  private readonly storage = inject(BrowserStorage);
  private readonly document = inject(DOCUMENT);
  private readonly createClient = inject(CLOUD_CLIENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly config = inject(CLOUD_CONFIG);
  readonly enabled = !!(this.config.url && this.config.key);
  readonly user = signal<{ id: string; name: string } | null>(null);
  readonly status = signal<SyncStatus>('signed-out');
  readonly lastSync = signal<Date | null>(null);
  /** True while the session is being restored after a page load or the GitHub redirect. */
  readonly restoring = signal(false);
  readonly error = signal('');

  private client?: Promise<SupabaseClient>;
  /** The progress object that is known to be in the cloud – any other object is a local change. */
  private synced?: Progress;
  private pushTimer?: ReturnType<typeof setTimeout>;
  private lastPull = 0;
  private busy: Promise<void> = Promise.resolve();

  constructor() {
    if (!this.enabled || !this.isBrowser) return;

    afterNextRender(() => {
      const url = new URL(this.document.location.href);
      const returning = url.searchParams.has('code') || url.searchParams.has('error_description');
      if (returning || this.storage.has(AUTH_KEY)) void this.restore(url);
    });

    // Every local change is uploaded shortly after – a few changes in a row become one request.
    effect(() => {
      const current = this.progress.progress();
      if (!this.progress.loaded() || !this.user() || current === this.synced) return;
      this.writeMeta({ ...this.meta()!, dirty: true });
      clearTimeout(this.pushTimer);
      this.pushTimer = setTimeout(() => void this.run(() => this.push()), PUSH_DELAY);
    });

    const window = this.document.defaultView;
    this.document.addEventListener('visibilitychange', () => {
      if (this.document.visibilityState === 'visible' && Date.now() - this.lastPull > PULL_INTERVAL) void this.sync();
    });
    window?.addEventListener('online', () => void this.sync());
  }

  /** Redirects to GitHub; afterwards GitHub sends the visitor back to `returnPath`. */
  async signIn(returnPath: string): Promise<void> {
    this.error.set('');
    const client = await this.getClient();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: new URL(returnPath, this.document.location.origin).href },
    });
    if (error) this.error.set(error.message);
  }

  /** Ends the session. The progress stays in this browser. */
  async signOut(): Promise<void> {
    const client = await this.getClient();
    await this.busy;
    await client.auth.signOut({ scope: 'local' });
    this.signedOut();
  }

  /** Deletes the account and its cloud progress (Supabase function delete_my_account). */
  async deleteAccount(): Promise<boolean> {
    const client = await this.getClient();
    await this.busy;
    const { error } = await client.rpc('delete_my_account');
    if (error) {
      this.error.set(error.message);
      return false;
    }
    await client.auth.signOut({ scope: 'local' });
    this.signedOut();
    return true;
  }

  /** Brings in changes from other devices and uploads local ones. */
  sync(): Promise<void> {
    if (!this.user()) return Promise.resolve();
    return this.run(() => this.pull());
  }

  private async restore(url: URL): Promise<void> {
    this.restoring.set(true);
    try {
      const client = await this.getClient();
      // With ?code=… in the URL, getSession() waits until the client has exchanged it for a session.
      const { data, error } = await client.auth.getSession();
      const failure = url.searchParams.get('error_description') ?? error?.message;
      if (url.searchParams.has('code') || url.searchParams.has('error_description')) {
        for (const key of ['code', 'error', 'error_code', 'error_description']) url.searchParams.delete(key);
        this.document.defaultView?.history.replaceState(this.document.defaultView.history.state, '', url.pathname + url.search + url.hash);
      }
      if (failure) this.error.set(failure);
      if (!data.session) return;
      await this.signedIn(data.session.user);
      client.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') this.signedOut();
      });
    } catch (error) {
      this.error.set(String(error));
    } finally {
      this.restoring.set(false);
    }
  }

  private async signedIn(user: User): Promise<void> {
    const meta = this.meta();
    // Another account than last time: its cloud state is unrelated to the local one, so merge.
    if (meta?.userId !== user.id) this.writeMeta({ userId: user.id, dirty: true });
    await this.run(() => this.pull());
    const name = user.user_metadata['user_name'] ?? user.user_metadata['name'] ?? user.email ?? 'GitHub';
    this.user.set({ id: user.id, name });
  }

  private signedOut(): void {
    clearTimeout(this.pushTimer);
    this.user.set(null);
    this.status.set('signed-out');
    this.synced = undefined;
    this.writeMeta(undefined);
  }

  /** Runs one sync step after the previous one, so pulls and pushes never overlap. */
  private run(step: () => Promise<void>): Promise<void> {
    this.busy = this.busy.then(async () => {
      this.status.set('syncing');
      try {
        await step();
        this.status.set('saved');
        this.lastSync.set(new Date());
        this.error.set('');
      } catch (error) {
        this.status.set('error');
        this.error.set(error instanceof Error ? error.message : String(error));
      }
    });
    return this.busy;
  }

  private async pull(): Promise<void> {
    this.lastPull = Date.now();
    const client = await this.getClient();
    const { data, error } = await client
      .from('progress')
      .select('data, updated_at')
      .eq('app', SITE.storagePrefix)
      .maybeSingle<ProgressRow>();
    if (error) throw error;
    const meta = this.meta()!;
    const local = this.progress.progress();
    const remote = data ? normalizeProgress(data.data) : undefined;

    if (!data || !remote) return this.push();
    if (data.updated_at === meta.base) {
      // Nothing new in the cloud – just upload what changed here.
      if (meta.dirty) return this.push();
      this.synced = local;
      return;
    }
    if (meta.base && !meta.dirty) {
      // Only the cloud changed: take it as it is, including removals made on the other device.
      this.apply(remote, data.updated_at);
      return;
    }
    // Both sides changed (or this is the first sync on this device): combine them.
    this.apply(mergeProgress(local, remote));
    await this.push();
  }

  private async push(): Promise<void> {
    clearTimeout(this.pushTimer);
    const client = await this.getClient();
    const user = (await client.auth.getSession()).data.session?.user;
    if (!user) throw new Error('Not signed in');
    const snapshot = this.progress.progress();
    const { data, error } = await client
      .from('progress')
      .upsert({ user_id: user.id, app: SITE.storagePrefix, data: snapshot }, { onConflict: 'user_id,app' })
      .select('updated_at')
      .single<Pick<ProgressRow, 'updated_at'>>();
    if (error) throw error;
    this.synced = snapshot;
    // Changed again while uploading? Then it stays dirty and the effect schedules the next push.
    this.writeMeta({ userId: user.id, base: data.updated_at, dirty: this.progress.progress() !== snapshot });
  }

  private apply(progress: Progress, base?: string): void {
    this.synced = progress;
    this.progress.replace(progress);
    const meta = this.meta()!;
    this.writeMeta(base ? { ...meta, base, dirty: false } : { ...meta, dirty: true });
  }

  private getClient(): Promise<SupabaseClient> {
    this.client ??= this.createClient();
    return this.client;
  }

  private meta(): SyncMeta | undefined {
    return this.storage.read<SyncMeta>(META_KEY);
  }

  private writeMeta(meta: SyncMeta | undefined): void {
    if (meta) this.storage.write(META_KEY, meta);
    else this.storage.remove(META_KEY);
  }
}
