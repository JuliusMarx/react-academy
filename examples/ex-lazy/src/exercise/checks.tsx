import { code, type Check } from './check-kit';
import raw from '../App.tsx?raw';

const source = code(raw);

export const exercise = 'ex-lazy';

export const checks: Check[] = [
  {
    id: 'hidden-at-first',
    run: (t) => t.expect(t.$$('#chart').length === 0, 'The chart should only appear after clicking "Show chart"'),
  },
  {
    id: 'shows-chart',
    run: async (t) => {
      await t.click(t.button('Show chart'));
      await t.eventually(() => t.expect(t.$$('#chart').length === 1, 'After clicking "Show chart" the chart should appear'));
    },
  },
  {
    id: 'lazy-import',
    run: (t) => {
      t.expect(!/import\s+Chart\s+from\s+['"]\.\/Chart['"]/.test(source), "Remove the static import of './Chart'");
      t.expect(/lazy\(\s*\(\)\s*=>\s*import\(\s*['"]\.\/Chart['"]\s*\)\s*\)/.test(source), "Load Chart with lazy(() => import('./Chart'))");
      t.expect(/<Suspense\b[^>]*fallback=/.test(source) && /id="loading"/.test(source), 'Wrap the chart in <Suspense> with the fallback <p id="loading">');
    },
  },
];
