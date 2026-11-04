import type { Check } from './check-kit';
import * as slice from '../todosSlice';

export const exercise = 'ex-redux';

type Creators = Record<string, ((payload: unknown) => { type: string; payload: unknown }) | undefined>;
const creators = slice as unknown as Creators;
const reducer = slice.todosSlice.reducer;
const start = [{ id: 1, title: 'Learn Redux Toolkit', done: false }];

const creator = (t: Parameters<Check['run']>[0], name: string) => {
  const fn = creators[name];
  t.expect(typeof fn === 'function', `todosSlice.ts should export the action creator "${name}"`);
  return fn!;
};

export const checks: Check[] = [
  {
    id: 'added',
    run: (t) => {
      const next = reducer(start, creator(t, 'added')('Use slices'));
      t.expect(next.length === 2 && next[1].title === 'Use slices' && next[1].done === false, `added should append an open todo, got ${JSON.stringify(next)}`);
      t.expect(start.length === 1, 'The old state must not change');
    },
  },
  {
    id: 'toggled',
    run: (t) => {
      const next = reducer(start, creator(t, 'toggled')(1));
      t.expect(next[0].done === true, 'toggled(1) should mark todo 1 as done');
      t.expect(start[0].done === false, 'The old state must not change');
    },
  },
  {
    id: 'removed',
    run: (t) => {
      const next = reducer(start, creator(t, 'removed')(1));
      t.expect(next.length === 0, 'removed(1) should remove todo 1');
    },
  },
  {
    id: 'app-works',
    run: async (t) => {
      await t.type('#title', 'Ship it');
      await t.click(t.button('Add'));
      const items = () => t.$$('#todos li');
      t.expect(items().some((li) => li.textContent?.includes('Ship it')), 'The new todo should appear in the app');
      await t.click(items()[0].querySelector('input')!);
      t.expect(items()[0].classList.contains('done'), 'Ticking the first todo should mark it done');
    },
  },
];
