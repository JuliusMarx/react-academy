import type { Check } from './check-kit';

export const exercise = 'ex-counter';

export const checks: Check[] = [
  {
    id: 'increments',
    run: async (t) => {
      t.expectText('#count', '0');
      await t.click(t.button('+'));
      await t.click(t.button('+'));
      t.expectText('#count', '2');
    },
  },
  {
    id: 'decrements',
    run: async (t) => {
      await t.click(t.button('−'));
      t.expectText('#count', '1');
      await t.click(t.button('−'));
      await t.click(t.button('−'));
      t.expectText('#count', '0');
    },
  },
  {
    id: 'adds-three',
    run: async (t) => {
      await t.click(t.button('+3'));
      t.expectText('#count', '3');
    },
  },
  {
    id: 'resets',
    run: async (t) => {
      await t.click(t.button('+'));
      await t.click(t.button('Reset'));
      t.expectText('#count', '0');
    },
  },
];
