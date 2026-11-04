import type { Check } from './check-kit';

export const exercise = 'ex-shopping-list';

const names = (t: Parameters<Check['run']>[0]) => t.$$('#items li').map((li) => li.textContent?.replace('Remove', '').trim());

export const checks: Check[] = [
  {
    id: 'adds-item',
    run: async (t) => {
      await t.type('#new-item', 'Milk');
      await t.click(t.button('Add'));
      const list = names(t);
      t.expect(list.length === 3 && list[2] === 'Milk', `Expected Bread, Apples, Milk – the list shows ${list.join(', ')}`);
    },
  },
  {
    id: 'toggles-item',
    run: async (t) => {
      const first = t.$('#items li');
      await t.click(first.querySelector<HTMLElement>('input[type=checkbox]')!);
      t.expect(t.$('#items li').classList.contains('bought'), 'After ticking Bread, its <li> should have the class "bought"');
      await t.click(t.$('#items li input[type=checkbox]'));
      t.expect(!t.$('#items li').classList.contains('bought'), 'Ticking Bread again should remove "bought"');
    },
  },
  {
    id: 'removes-item',
    run: async (t) => {
      const before = names(t);
      const bread = t.$$('#items li').find((li) => li.textContent?.includes('Bread'));
      t.expect(bread, 'Bread is missing from the list');
      await t.click(bread!.querySelector('button')!);
      const after = names(t);
      t.expect(!after.includes('Bread'), 'Bread is still in the list after clicking Remove');
      t.expect(after.length === before.length - 1, 'Remove should only remove one item');
    },
  },
];
