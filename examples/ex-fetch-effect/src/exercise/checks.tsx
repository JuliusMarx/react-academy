import type { Check } from './check-kit';

export const exercise = 'ex-fetch-effect';

const userText = (t: Parameters<Check['run']>[0]) => (t.$$('#user').length ? t.text('#user') : '');

export const checks: Check[] = [
  {
    id: 'loads-user',
    run: async (t) => {
      await t.eventually(() => t.expectText('#user', 'Ada Lovelace'));
    },
  },
  {
    id: 'shows-loading',
    run: async (t) => {
      await t.select('#user-id', '3');
      t.expect(t.$$('#loading').length === 1, 'Right after switching to user 3, #loading should be shown');
      t.expect(!userText(t).includes('Ada'), 'While user 3 loads, the old user should not be shown any more');
      await t.eventually(() => t.expectText('#user', 'Grace Hopper'));
      t.expect(t.$$('#loading').length === 0, '#loading should disappear once the user is loaded');
    },
  },
  {
    id: 'shows-error',
    run: async (t) => {
      await t.select('#user-id', '4');
      await t.eventually(() => t.expectText('#error', 'User not found'));
    },
  },
  {
    id: 'no-race',
    run: async (t) => {
      // User 1 takes 700 ms, user 2 only 100 ms: the slow, outdated answer arrives last.
      await t.select('#user-id', '1');
      await t.select('#user-id', '2');
      await t.settle(1000);
      t.expectText('#user', 'Linus Torvalds');
    },
  },
];
