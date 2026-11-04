import type { Check } from './check-kit';
import { renders } from '../ProductList';

export const exercise = 'ex-memo';

export const checks: Check[] = [
  {
    id: 'skips-renders',
    run: async (t) => {
      const before = renders.count;
      await t.type('#note', 'a');
      await t.type('#note', 'ab');
      await t.type('#note', 'abc');
      const extra = renders.count - before;
      t.expect(extra === 0, `Typing a note rendered ProductList ${extra} more times – it should not render at all`);
    },
  },
  {
    id: 'still-filters',
    run: async (t) => {
      await t.type('#query', 'co');
      const names = t.$$('#products button').map((b) => b.textContent);
      t.expect(names.join() === 'Coffee,Cocoa', `Filter "co" should show Coffee, Cocoa – it shows ${names.join(', ')}`);
    },
  },
  {
    id: 'still-selects',
    run: async (t) => {
      await t.click(t.button('Cocoa'));
      t.expectText('#selected', 'Selected: 2');
    },
  },
];
