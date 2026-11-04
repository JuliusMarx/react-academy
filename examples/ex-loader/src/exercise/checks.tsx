import { code, type Check } from './check-kit';
import raw from '../App.tsx?raw';

const source = code(raw);

export const exercise = 'ex-loader';

export const checks: Check[] = [
  {
    id: 'loads-recipe',
    run: async (t) => {
      await t.click(t.$$('nav a').find((a) => a.textContent === 'Risotto')!);
      await t.eventually(() => t.expectText('#title', 'Risotto'));
      t.expectText('#minutes', '40 min');
    },
  },
  {
    id: 'direct-url',
    run: async (t) => {
      await t.navigate('/recipes/1');
      await t.eventually(() => t.expectText('#title', 'Pancakes'));
    },
  },
  {
    id: 'not-found',
    run: async (t) => {
      await t.click(t.$$('nav a').find((a) => a.textContent === 'Missing')!);
      await t.eventually(() => t.expectText('#error', 'Recipe not found'));
    },
  },
  {
    id: 'uses-loader',
    run: (t) => {
      t.expect(/\bloader\s*[:(]/.test(source) || /loader:\s*\w+/.test(source), 'Load the recipe in a route loader');
      t.expect(/useLoaderData\s*[<(]/.test(source), 'Read the recipe with useLoaderData()');
      t.expect(!/useEffect/.test(source), 'No useEffect needed – the loader does the fetching');
    },
  },
];
