import { code, type Check } from './check-kit';
import raw from '../SubmitButton.tsx?raw';

const source = code(raw);

export const exercise = 'ex-form-status';

const button = (t: Parameters<Check['run']>[0]) => t.$('button[type=submit]') as HTMLButtonElement;

export const checks: Check[] = [
  {
    id: 'pending-state',
    run: async (t) => {
      await t.type('#title', 'Holiday');
      await t.click(button(t));
      t.expect(button(t).disabled, 'While saving, the button should be disabled');
      t.expect(button(t).textContent?.includes('Saving Holiday'), `While saving, the button should read "Saving Holiday …", it reads "${button(t).textContent}"`);
    },
  },
  {
    id: 'back-to-normal',
    run: async (t) => {
      await t.eventually(() => t.expectText('#saved', 'Holiday'));
      t.expect(!button(t).disabled && button(t).textContent === 'Save', `After saving, the button should read "Save" again, it reads "${button(t).textContent}"`);
    },
  },
  {
    id: 'uses-form-status',
    run: (t) => t.expect(/useFormStatus\s*\(/.test(source), 'Read the form status with useFormStatus() in SubmitButton'),
  },
];
