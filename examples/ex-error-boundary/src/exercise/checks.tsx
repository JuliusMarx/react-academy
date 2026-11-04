import type { Check } from './check-kit';

export const exercise = 'ex-error-boundary';

const clickCounter = async (t: Parameters<Check['run']>[0], times: number) => {
  for (let i = 0; i < times; i++) await t.click(t.button('Count'));
};

export const checks: Check[] = [
  {
    id: 'shows-fallback',
    run: async (t) => {
      await clickCounter(t, 3);
      t.expectText('[role=alert]', 'Something went wrong: Counter exploded');
    },
  },
  {
    id: 'rest-survives',
    run: (t) => {
      t.expectText('h1', 'Dashboard');
      t.expectText('#footer', 'keeps working');
    },
  },
  {
    id: 'try-again',
    run: async (t) => {
      await t.click(t.button('Try again'));
      t.expect(t.$$('[role=alert]').length === 0, 'After Try again the error message should disappear');
      t.expectText('p button', 'Count: 0');
    },
  },
];
