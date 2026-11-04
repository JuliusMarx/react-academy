import type { Check } from './check-kit';

export const exercise = 'ex-optimistic';

const items = (t: Parameters<Check['run']>[0]) => t.$$('#todos li');
const titles = (t: Parameters<Check['run']>[0]) => items(t).map((li) => li.textContent?.trim());

export const checks: Check[] = [
  {
    id: 'shows-immediately',
    run: async (t) => {
      await t.type('#title', 'Walk the dog');
      await t.click(t.button('Add'));
      const li = items(t).find((el) => el.textContent?.includes('Walk the dog'));
      t.expect(li, 'The new todo should appear immediately, before the server answers');
      t.expect(li!.classList.contains('saving'), 'While saving, the new todo should have the class "saving"');
    },
  },
  {
    id: 'confirmed',
    run: async (t) => {
      await t.eventually(() => {
        const li = items(t).find((el) => el.textContent?.includes('Walk the dog'));
        t.expect(li && !li.classList.contains('saving'), 'Once saved, the todo should lose the class "saving"');
      });
      const count = titles(t).filter((x) => x === 'Walk the dog').length;
      t.expect(count === 1, `"Walk the dog" should be in the list exactly once, found ${count}`);
    },
  },
  {
    id: 'rollback',
    run: async (t) => {
      await t.type('#title', 'This will fail');
      await t.click(t.button('Add'));
      t.expect(titles(t).includes('This will fail'), 'The todo should appear immediately, even if saving fails later');
      await t.eventually(() => t.expectText('#error', 'Saving failed'));
      t.expect(!titles(t).includes('This will fail'), 'After the error the optimistic todo should disappear again');
    },
  },
];
