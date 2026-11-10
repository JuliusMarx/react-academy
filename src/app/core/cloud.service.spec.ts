import { TestBed } from '@angular/core/testing';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CLOUD_CLIENT, CLOUD_CONFIG, CloudService } from './cloud.service';
import { ProgressService } from './progress.service';
import { SITE } from './site';

interface Row {
  data: unknown;
  updated_at: string;
}

/** Just enough of the Supabase client for CloudService, with the "progress" table in memory. */
function fakeSupabase(row: Row | null) {
  const db = { row, uploads: [] as unknown[], clock: 0 };
  const user = { id: 'user-1', user_metadata: { user_name: 'octocat' } };
  const client = {
    auth: {
      getSession: async () => ({ data: { session: { user } }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: db.row, error: null }) }) }),
      upsert: (value: { data: unknown }) => ({
        select: () => ({
          single: async () => {
            db.row = { data: structuredClone(value.data), updated_at: `t${++db.clock}` };
            db.uploads.push(db.row.data);
            return { data: { updated_at: db.row.updated_at }, error: null };
          },
        }),
      }),
    }),
    rpc: async () => ({ error: null }),
  };
  return { client: client as unknown as SupabaseClient, db };
}

const key = (name: string) => `${SITE.storagePrefix}.${name}`;
const remoteProgress = (completedLessons: string[]) => ({ version: 1, completedLessons });

/** Sets up the services as after a page load with a stored session, and waits for the first sync. */
async function signedIn(row: Row | null) {
  const supabase = fakeSupabase(row);
  localStorage.setItem(key('auth'), '{"session":"stored"}');
  TestBed.configureTestingModule({
    providers: [
      { provide: CLOUD_CONFIG, useValue: { url: 'https://example.supabase.co', key: 'publishable' } },
      { provide: CLOUD_CLIENT, useValue: () => Promise.resolve(supabase.client) },
    ],
  });
  const progress = TestBed.inject(ProgressService);
  const cloud = TestBed.inject(CloudService);
  TestBed.tick();
  await vi.waitFor(() => expect(cloud.user()).not.toBeNull());
  return { ...supabase, progress, cloud };
}

describe('CloudService', () => {
  beforeEach(() => localStorage.clear());

  it('merges the local and the cloud progress on the first sign-in and uploads the result', async () => {
    localStorage.setItem(key('progress'), JSON.stringify(remoteProgress(['a/local'])));
    const { progress, cloud, db } = await signedIn({ data: remoteProgress(['b/cloud']), updated_at: 't0' });

    expect(cloud.user()?.name).toBe('octocat');
    expect(progress.progress().completedLessons).toEqual(['b/cloud', 'a/local']);
    expect(db.uploads).toHaveLength(1);
    expect((db.row!.data as { completedLessons: string[] }).completedLessons).toEqual(['b/cloud', 'a/local']);
  });

  it('uploads the local progress when the cloud has none yet', async () => {
    localStorage.setItem(key('progress'), JSON.stringify(remoteProgress(['a/local'])));
    const { db } = await signedIn(null);
    expect((db.row!.data as { completedLessons: string[] }).completedLessons).toEqual(['a/local']);
  });

  it('takes newer cloud progress as it is when nothing changed locally – including removals', async () => {
    localStorage.setItem(key('progress'), JSON.stringify(remoteProgress(['a/one', 'a/two'])));
    localStorage.setItem(key('cloud'), JSON.stringify({ userId: 'user-1', base: 't1', dirty: false }));
    const { progress, db } = await signedIn({ data: remoteProgress(['a/one']), updated_at: 't2' });

    expect(progress.progress().completedLessons).toEqual(['a/one']);
    expect(db.uploads).toHaveLength(0);
  });

  it('uploads local changes shortly after they happen', async () => {
    const { progress, db } = await signedIn({ data: remoteProgress([]), updated_at: 't0' });
    const uploads = db.uploads.length;

    progress.markCompleted('a/new');
    TestBed.tick();
    await vi.waitFor(() => expect(db.uploads.length).toBe(uploads + 1), { timeout: 4000 });
    expect((db.row!.data as { completedLessons: string[] }).completedLessons).toEqual(['a/new']);
    expect(JSON.parse(localStorage.getItem(key('cloud'))!)).toMatchObject({ base: db.row!.updated_at, dirty: false });
  });

  it('counts an anonymous page view with one small request, without the Supabase library', async () => {
    const createClient = vi.fn();
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 201 }));
    TestBed.configureTestingModule({
      providers: [
        { provide: CLOUD_CONFIG, useValue: { url: 'https://example.supabase.co', key: 'publishable' } },
        { provide: CLOUD_CLIENT, useValue: createClient },
      ],
    });
    const cloud = TestBed.inject(CloudService);
    TestBed.tick();
    await cloud.recordPageView('/de/signals', 'de');

    expect(createClient).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('https://example.supabase.co/rest/v1/page_views');
    expect(JSON.parse(init!.body as string)).toEqual({ app: SITE.storagePrefix, path: '/de/signals', lang: 'de' });
    fetch.mockRestore();
  });

  it('keeps the local progress after signing out', async () => {
    const { progress, cloud } = await signedIn({ data: remoteProgress(['a/one']), updated_at: 't0' });
    await cloud.signOut();
    expect(cloud.user()).toBeNull();
    expect(progress.progress().completedLessons).toEqual(['a/one']);
    expect(localStorage.getItem(key('cloud'))).toBeNull();
  });
});
