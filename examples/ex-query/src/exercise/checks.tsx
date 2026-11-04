import { code, type Check } from './check-kit';
import raw from '../Notes.tsx?raw';

const source = code(raw);

export const exercise = 'ex-query';

const notes = (t: Parameters<Check['run']>[0]) => t.$$('#notes li').map((li) => li.textContent);

export const checks: Check[] = [
  {
    id: 'loads',
    run: async (t) => {
      await t.eventually(() => t.expect(notes(t).join() === 'Buy milk,Call Ada', `Expected Buy milk, Call Ada – the list shows ${notes(t).join(', ') || 'nothing'}`));
    },
  },
  {
    id: 'adds',
    run: async (t) => {
      await t.type('#text', 'Water plants');
      await t.click(t.button('Add'));
      await t.eventually(() => t.expect(notes(t).includes('Water plants'), 'The new note should appear after saving'));
    },
  },
  {
    id: 'uses-query',
    run: (t) => {
      t.expect(/useQuery\s*\(/.test(source), 'Load the notes with useQuery');
      t.expect(/useMutation\s*\(/.test(source), 'Save notes with useMutation');
      t.expect(/invalidateQueries/.test(source), 'Invalidate the notes query after saving');
      t.expect(/id="loading"/.test(source), 'Show <p id="loading"> while the notes are pending');
      t.expect(!/useEffect/.test(source), 'No useEffect needed any more');
    },
  },
];
