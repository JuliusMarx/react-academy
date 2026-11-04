import type { Check } from './check-kit';

export const exercise = 'ex-lists';

export const checks: Check[] = [
  {
    id: 'renders-items',
    run: (t) => {
      const items = t.$$('#products li');
      t.expect(items.length === 3, `Expected 3 list items, found ${items.length}`);
      t.expect(items[0].textContent?.includes('Coffee'), 'The first item should show "Coffee"');
      t.expect(items[0].textContent?.includes('3.50'), 'The first item should show its price "3.50"');
    },
  },
  {
    id: 'sold-out',
    run: (t) => {
      const soldOut = t.$$('#products .sold-out');
      t.expect(soldOut.length === 1, `Exactly one product is sold out, but ${soldOut.length} items are marked`);
      t.expect(soldOut[0].closest('li')?.textContent?.includes('Tea'), 'Tea should be marked as sold out');
    },
  },
  {
    id: 'empty-state',
    run: async (t) => {
      t.expect(!t.$$('#empty').length, '#empty should only appear when the list is empty');
      await t.click(t.button('Clear'));
      t.expectText('#empty', 'No products');
    },
  },
];
