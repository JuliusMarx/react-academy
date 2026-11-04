import { code, type Check } from './check-kit';
import raw from '../App.tsx?raw';

const source = code(raw);

export const exercise = 'ex-action-state';

const comments = (t: Parameters<Check['run']>[0]) => t.$$('#comments li').map((li) => li.textContent);
const submit = (t: Parameters<Check['run']>[0]) => t.$('button[type=submit]') as HTMLButtonElement;

export const checks: Check[] = [
  {
    id: 'validates',
    run: async (t) => {
      await t.type('#text', 'no');
      await t.click(submit(t));
      await t.eventually(() => t.expectText('#error', 'Comment is too short'));
      t.expect(comments(t).length === 1, 'A too short comment must not be added');
    },
  },
  {
    id: 'pending',
    run: async (t) => {
      await t.type('#text', 'Great article');
      await t.click(submit(t));
      t.expect(submit(t).disabled, 'While posting, the button should be disabled');
      t.expect(submit(t).textContent?.includes('Posting'), `While posting, the button should read "Posting …", it reads "${submit(t).textContent}"`);
    },
  },
  {
    id: 'adds-comment',
    run: async (t) => {
      await t.eventually(() => t.expect(comments(t).includes('Great article'), 'The new comment should appear in the list'));
      t.expect(t.$$('#error').length === 0 || t.text('#error') === '', 'After a valid comment the error should be gone');
      t.expect(!submit(t).disabled, 'After posting, the button should be enabled again');
    },
  },
  {
    id: 'uses-action-state',
    run: (t) => t.expect(/useActionState\s*\(/.test(source), 'Use useActionState'),
  },
];
