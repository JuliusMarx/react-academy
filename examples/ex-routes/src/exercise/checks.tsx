import type { Check } from './check-kit';

export const exercise = 'ex-routes';

const link = (t: Parameters<Check['run']>[0], label: string) => {
  const a = t.$$('nav a').find((el) => el.textContent?.trim() === label);
  t.expect(a, `No link "${label}" in <nav>`);
  return a!;
};

export const checks: Check[] = [
  {
    id: 'home',
    run: (t) => t.expectText('main h2', 'Welcome'),
  },
  {
    id: 'links-navigate',
    run: async (t) => {
      await t.click(link(t, 'About'));
      t.expect(t.path() === '/about', `After clicking About the URL should be /about, it is ${t.path()}`);
      t.expectText('main h2', 'About us');
      await t.click(link(t, 'Contact'));
      t.expectText('main h2', 'Contact');
    },
  },
  {
    id: 'active-link',
    run: (t) => {
      t.expect(link(t, 'Contact').classList.contains('active'), 'On /contact the Contact link should have the class "active"');
      t.expect(!link(t, 'About').classList.contains('active'), 'On /contact the About link should not be active');
    },
  },
  {
    id: 'not-found',
    run: async (t) => {
      await t.navigate('/nope');
      t.expectText('main h2', 'Page not found');
      await t.navigate('/');
      t.expectText('main h2', 'Welcome');
    },
  },
];
