import { code, type Check } from './check-kit';
import raw from '../App.tsx?raw';

const source = code(raw);

export const exercise = 'ex-deferred';

const results = (t: Parameters<Check['run']>[0]) => t.$$('#results li').map((li) => li.textContent);

export const checks: Check[] = [
  {
    id: 'filters',
    run: async (t) => {
      await t.type('#query', 'ber');
      await t.eventually(() => t.expect(results(t).join() === 'Berlin,Bern', `"ber" should show Berlin, Bern – it shows ${results(t).join(', ')}`));
    },
  },
  {
    id: 'stale-class',
    run: async (t) => {
      await t.eventually(() => t.expect(!t.$('#list').classList.contains('stale'), 'Once the list is up to date, #list should not have the class "stale"'));
      t.expect(/className=\{[^}]*stale/.test(source) || /['"`]stale['"`]/.test(source), 'Give #list the class "stale" while it shows an older query');
    },
  },
  {
    id: 'uses-deferred',
    run: (t) => {
      t.expect(/useDeferredValue\(\s*query\s*\)/.test(source), 'Create the deferred query with useDeferredValue(query)');
      t.expect(!/<SlowResults\s+query=\{query\}/.test(source), 'Pass the deferred query to SlowResults, not query itself');
    },
  },
];
