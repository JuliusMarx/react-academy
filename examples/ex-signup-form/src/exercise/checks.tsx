import type { Check } from './check-kit';

export const exercise = 'ex-signup-form';

const submit = (t: Parameters<Check['run']>[0]) => t.$('button[type=submit]') as HTMLButtonElement;
const value = (t: Parameters<Check['run']>[0], selector: string) => (t.$(selector) as HTMLInputElement).value;

export const checks: Check[] = [
  {
    id: 'live-preview',
    run: async (t) => {
      t.expectText('#preview', 'Hello, stranger!');
      await t.type('#name', 'Ada');
      t.expectText('#preview', 'Hello, Ada!');
      t.expect(value(t, '#name') === 'Ada', 'The name input should keep what was typed');
    },
  },
  {
    id: 'disabled-when-invalid',
    run: async (t) => {
      await t.type('#name', 'A');
      await t.type('#email', 'ada@example.com');
      t.expect(submit(t).disabled, 'With a 1-character name the button should be disabled');
      await t.type('#name', 'Ada');
      await t.type('#email', 'ada.example.com');
      t.expect(submit(t).disabled, 'With an email without "@" the button should be disabled');
    },
  },
  {
    id: 'enabled-when-valid',
    run: async (t) => {
      await t.type('#name', 'Ada');
      await t.type('#email', 'ada@example.com');
      t.expect(!submit(t).disabled, 'With a valid name and email the button should be enabled');
    },
  },
  {
    id: 'submit-resets',
    run: async (t) => {
      await t.type('#name', 'Ada');
      await t.type('#email', 'ada@example.com');
      await t.click(submit(t));
      t.expectText('#thanks', 'Thanks, Ada!');
      t.expect(value(t, '#name') === '' && value(t, '#email') === '', 'After submitting, both inputs should be empty');
    },
  },
];
