import { code, type Check } from './check-kit';
import raw from '../App.tsx?raw';

const source = code(raw);

export const exercise = 'ex-suspense';

export const checks: Check[] = [
  {
    id: 'shows-book',
    run: async (t) => {
      await t.eventually(() => t.expectText('#book', 'Dune'));
    },
  },
  {
    id: 'shows-fallback',
    run: async (t) => {
      await t.click(t.button('Book 3'));
      t.expectText('#fallback', 'Loading book');
      await t.eventually(() => t.expectText('#book', 'Foundation'));
      t.expect(t.$$('#fallback').length === 0, 'The fallback should disappear once the book is loaded');
    },
  },
  {
    id: 'uses-use',
    run: (t) => {
      t.expect(/\buse\(\s*bookPromise\s*\)/.test(source), 'Read the book with use(bookPromise)');
      t.expect(/<Suspense\b/.test(source), 'Wrap BookDetails in <Suspense>');
      t.expect(!/useEffect/.test(source), 'No useEffect needed here');
    },
  },
];
