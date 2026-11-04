import type { Check } from './check-kit';
import source from '../App.tsx?raw';

export const exercise = 'ex-document-title';

export const checks: Check[] = [
  {
    id: 'initial-title',
    run: (t) => t.expect(document.title === 'Clicked 0 times', `The title should be "Clicked 0 times", it is "${document.title}"`),
  },
  {
    id: 'updates-title',
    run: async (t) => {
      await t.click(t.button('Click me'));
      await t.click(t.button('Click me'));
      t.expect(document.title === 'Clicked 2 times', `After two clicks the title should be "Clicked 2 times", it is "${document.title}"`);
    },
  },
  {
    id: 'uses-effect',
    run: (t) => {
      t.expect(/useEffect\s*\(/.test(source), 'Set the title inside useEffect');
      t.expect(/\[\s*count\s*\]/.test(source), 'The effect should list count as its only dependency: [count]');
    },
  },
];
