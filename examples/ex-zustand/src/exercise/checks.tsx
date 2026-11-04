import type { Check } from './check-kit';
import { useTodoStore } from '../store';

export const exercise = 'ex-zustand';

const titles = (t: Parameters<Check['run']>[0]) => t.$$('#todos li').map((li) => li.textContent?.trim());

export const checks: Check[] = [
  {
    id: 'adds',
    run: async (t) => {
      await t.type('#title', 'Write tests');
      await t.click(t.button('Add'));
      t.expect(titles(t).includes('Write tests'), `"Write tests" should appear in the list – it shows ${titles(t).join(', ')}`);
      t.expectText('#open', '2 open');
    },
  },
  {
    id: 'toggles',
    run: async (t) => {
      await t.click(t.$('#todos li input'));
      t.expectText('#open', '1 open');
      const first = useTodoStore.getState().todos[0];
      t.expect(first.done, 'The store should mark the first todo as done');
    },
  },
  {
    id: 'immutable',
    run: (t) => {
      const before = useTodoStore.getState().todos;
      useTodoStore.getState().toggle(before[0].id);
      const after = useTodoStore.getState().todos;
      t.expect(after !== before, 'toggle() should create a new todos array instead of changing the old one');
      t.expect(before[0].done !== after[0].done, 'toggle() should not change the existing todo object');
      useTodoStore.getState().toggle(before[0].id);
    },
  },
  {
    id: 'clears-done',
    run: async (t) => {
      await t.click(t.button('Clear done'));
      t.expect(!titles(t).includes('Try Zustand'), 'Clear done should remove the done todo "Try Zustand"');
      t.expect(titles(t).includes('Write tests'), 'Clear done should keep open todos');
    },
  },
];
