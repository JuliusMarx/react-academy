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
export type CloudNotice = 'confirm-sent' | 'reset-sent' | 'password-updated' | 'link-other-browser';

/** Result of the Supabase function admin_stats (see docs/cloud-setup.md). */
export interface AdminStats {
  views: { total: number; signedIn: number; anonymous: number; today: number };
  daily: { day: string; signedIn: number; anonymous: number }[];
  topPages: { path: string; views: number }[];
  /** Distinct signed-in accounts that viewed a page in the period. */
  activeUsers: number;
  users: { total: number; new: number; activeWeek: number; github: number; email: number };
  learners: { withProgress: number; completedLessons: number; certificates: number };
}

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
  /** Supabase error code of the last failure (e.g. "invalid_credentials"), for a translated message. */
  readonly errorCode = signal('');
  /** Outcome to tell the visitor about, e.g. that a confirmation email was sent. */
  readonly notice = signal<CloudNotice | ''>('');
  /** True after opening a password reset link: the account page asks for a new password. */
  readonly recovery = signal(false);
  /** True for accounts listed in the Supabase table "admins" (see docs/cloud-setup.md). */
  readonly isAdmin = signal(false);
  /** Settles once a stored session is restored (or there is none), e.g. before counting a page view. */
  readonly ready: Promise<void>;

  private markReady!: () => void;
  private client?: Promise<SupabaseClient>;
  /** The progress object that is known to be in the cloud – any other object is a local change. */
  private synced?: Progress;
  private pushTimer?: ReturnType<typeof setTimeout>;
  private lastPull = 0;
  private busy: Promise<void> = Promise.resolve();

  constructor() {
    this.ready = new Promise((resolve) => (this.markReady = resolve));
    if (!this.enabled || !this.isBrowser) {
      this.markReady();
      return;
    }

    afterNextRender(() => {
      const url = new URL(this.document.location.href);
      const returning = url.searchParams.has('code') || url.searchParams.has('error_description');
      if (returning || this.storage.has(AUTH_KEY)) void this.restore(url);
      else this.markReady();
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
    this.clearMessages();
    const client = await this.getClient();
    const { error } = await client.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: this.absolute(returnPath) },
    });
    if (error) this.fail(error);
  }

  /**
   * Creates an account with email and password. If Supabase requires a confirmed email address,
   * it sends a link that leads back to `returnPath`; otherwise the visitor is signed in right away.
   */
  async signUpWithEmail(email: string, password: string, returnPath: string): Promise<void> {
    this.clearMessages();
    const client = await this.getClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: this.absolute(returnPath) },
    });
    if (error) return this.fail(error);
    if (data.session) await this.signedIn(data.session.user);
    else this.notice.set('confirm-sent');
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    this.clearMessages();
    const client = await this.getClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return this.fail(error);
    await this.signedIn(data.user);
  }

  /** Sends a link to set a new password; it leads back to `returnPath`. */
  async resetPassword(email: string, returnPath: string): Promise<void> {
    this.clearMessages();
    const client = await this.getClient();
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: this.absolute(returnPath) });
    if (error) return this.fail(error);
    this.notice.set('reset-sent');
  }

  /** Sets a new password for the signed-in account (after a reset link, or any time). */
  async updatePassword(password: string): Promise<void> {
    this.clearMessages();
    const client = await this.getClient();
    const { error } = await client.auth.updateUser({ password });
    if (error) return this.fail(error);
    this.recovery.set(false);
    this.notice.set('password-updated');
  }

  /** Visitor statistics for the admin dashboard (Supabase function admin_stats, admins only). */
  async adminStats(app: string, days: number): Promise<AdminStats> {
    const client = await this.getClient();
    const { data, error } = await client.rpc('admin_stats', { p_app: app, p_days: days });
    if (error) throw error;
    return data as AdminStats;
  }

  /**
   * Counts a page view (table "page_views"): only the page, language and time – plus the account
   * for signed-in visitors. Anonymous views go out as one small request without the Supabase library.
   */
  async recordPageView(path: string, lang: string): Promise<void> {
    if (!this.enabled || !this.isBrowser) return;
    await this.ready;
    const row = { app: SITE.storagePrefix, path, lang };
    try {
      if (this.user()) {
        const client = await this.getClient();
        await client.from('page_views').insert(row);
        return;
      }
      await fetch(`${this.config.url}/rest/v1/page_views`, {
        method: 'POST',
        headers: { apikey: this.config.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(row),
        keepalive: true,
      });
    } catch {
      // Statistics are best effort – offline or blocked requests are simply not counted.
    }
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
      // An email link opened in another browser than the one that requested it: the address is
      // confirmed, but this browser can't finish the sign-in (it lacks the PKCE code verifier).
      if (failure && /code verifier/i.test(failure)) this.notice.set('link-other-browser');
      else if (failure) this.error.set(failure);
      if (!data.session) return;
      await this.signedIn(data.session.user);
    } catch (error) {
      this.error.set(String(error));
    } finally {
      this.restoring.set(false);
      this.markReady();
    }
  }

  private async signedIn(user: User): Promise<void> {
    const meta = this.meta();
    // Another account than last time: its cloud state is unrelated to the local one, so merge.
    if (meta?.userId !== user.id) this.writeMeta({ userId: user.id, dirty: true });
    await this.run(() => this.pull());
    const name = user.user_metadata['user_name'] ?? user.user_metadata['name'] ?? user.email ?? 'GitHub';
    this.user.set({ id: user.id, name });
    const client = await this.getClient();
    const { data } = await client.rpc('is_admin');
    this.isAdmin.set(data === true);
  }

  private signedOut(): void {
    clearTimeout(this.pushTimer);
    this.user.set(null);
    this.isAdmin.set(false);
    this.recovery.set(false);
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
    this.client ??= this.createClient().then((client) => {
      // Only set signals here – Supabase must not be called again inside this callback.
      client.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') this.signedOut();
        if (event === 'PASSWORD_RECOVERY') this.recovery.set(true);
      });
      return client;
    });
    return this.client;
  }

  private absolute(path: string): string {
    return new URL(path, this.document.location.origin).href;
  }

  private clearMessages(): void {
    this.error.set('');
    this.errorCode.set('');
    this.notice.set('');
  }

  private fail(error: { message: string; code?: string }): void {
    this.error.set(error.message);
    this.errorCode.set(error.code ?? '');
  }

  private meta(): SyncMeta | undefined {
    return this.storage.read<SyncMeta>(META_KEY);
  }

  private writeMeta(meta: SyncMeta | undefined): void {
    if (meta) this.storage.write(META_KEY, meta);
    else this.storage.remove(META_KEY);
  }
}
