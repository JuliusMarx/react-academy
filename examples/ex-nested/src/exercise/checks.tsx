import type { Check } from './check-kit';

export const exercise = 'ex-nested';

const headers = (t: Parameters<Check['run']>[0]) => t.$$('header h1').length;

export const checks: Check[] = [
  {
    id: 'index-route',
    run: async (t) => {
      await t.navigate('/dashboard');
      t.expect(headers(t) === 1, `/dashboard should show the header exactly once, found ${headers(t)}`);
      t.expectText('#page .content', '3 new messages');
    },
  },
  {
    id: 'child-route',
    run: async (t) => {
      await t.click(t.$$('nav a').find((a) => a.textContent === 'Settings')!);
      t.expect(t.path() === '/dashboard/settings', `The URL should be /dashboard/settings, it is ${t.path()}`);
      t.expect(headers(t) === 1, `/dashboard/settings should show the shared header exactly once, found ${headers(t)}`);
      t.expectText('#page .content', 'Notifications: on');
    },
  },
  {
    id: 'active-nav',
    run: (t) => {
      const active = t.$$('nav a.active').map((a) => a.textContent);
      t.expect(active.join() === 'Settings', `On the settings page only "Settings" should be active, active: ${active.join(', ') || 'none'}`);
    },
  },
];
