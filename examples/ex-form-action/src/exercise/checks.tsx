import { code, type Check } from './check-kit';
import raw from '../App.tsx?raw';

const source = code(raw);

export const exercise = 'ex-form-action';

export const checks: Check[] = [
  {
    id: 'subscribes',
    run: async (t) => {
      await t.type('#email', 'ada@example.com');
      await t.click(t.button('Subscribe'));
      await t.eventually(() => t.expectText('#message', 'Subscribed: ada@example.com'));
    },
  },
  {
    id: 'resets',
    run: (t) => {
      const value = (t.$('#email') as HTMLInputElement).value;
      t.expect(value === '', `After subscribing the input should be empty, it contains "${value}"`);
    },
  },
  {
    id: 'uses-action',
    run: (t) => {
      t.expect(/<form\s[^>]*action=\{/.test(source), 'Pass a function to <form action={…}>');
      t.expect(!/preventDefault|onSubmit/.test(source), 'No onSubmit or preventDefault needed with a form action');
      t.expect(/name="email"/.test(source), 'Give the input name="email", so it ends up in the FormData');
    },
  },
];
