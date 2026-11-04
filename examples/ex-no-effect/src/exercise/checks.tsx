import { code, type Check } from './check-kit';
import raw from '../App.tsx?raw';

const source = code(raw);

export const exercise = 'ex-no-effect';

const names = (t: Parameters<Check['run']>[0]) => t.$$('#items li').map((li) => li.textContent?.trim());

export const checks: Check[] = [
  {
    id: 'filters',
    run: async (t) => {
      t.expectText('#summary', '4 of 4 shown');
      await t.type('#filter', 'ap');
      const list = names(t);
      t.expect(list.join(',') === 'Apple,Grape', `Filter "ap" should show Apple, Grape – it shows ${list.join(', ')}`);
      t.expectText('#summary', '2 of 4 shown');
    },
  },
  {
    id: 'new-items',
    run: async (t) => {
      await t.type('#filter', '');
      await t.type('#new', 'Apricot');
      await t.click(t.button('Add'));
      t.expect(names(t).includes('Apricot'), 'Apricot should appear in the list after adding it');
      t.expectText('#summary', '5 of 5 shown');
    },
  },
  {
    id: 'no-effect',
    run: (t) => {
      t.expect(!/useEffect\s*\(/.test(source), 'App.tsx should not use useEffect any more');
      t.expect(!/setVisible|setSummary/.test(source), 'Remove the "visible" and "summary" state – compute them instead');
    },
  },
];
