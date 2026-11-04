import type { ReactElement } from 'react';
import type { Check } from './check-kit';
import Button from '../Button';

export const exercise = 'ex-typescript';

// Rendered with "any" props, so the checks also work while Button's types are unfinished.
const AnyButton = Button as unknown as (props: Record<string, unknown>) => ReactElement;

export const checks: Check[] = [
  {
    id: 'variant-class',
    run: async (t) => {
      const primary = (await t.render(<AnyButton>Save</AnyButton>)).$('button');
      const danger = (await t.render(<AnyButton variant="danger">Delete</AnyButton>)).$('button');
      t.expect(primary.className === 'btn btn-primary', `Without variant the class should be "btn btn-primary", it is "${primary.className}"`);
      t.expect(danger.className === 'btn btn-danger', `With variant="danger" the class should be "btn btn-danger", it is "${danger.className}"`);
    },
  },
  {
    id: 'passes-props',
    run: async (t) => {
      const b = (await t.render(<AnyButton type="submit" disabled aria-label="Send form" title="Hint">Send</AnyButton>)).$('button') as HTMLButtonElement;
      t.expect(b.type === 'submit', `type="submit" should reach the <button>, its type is "${b.type}"`);
      t.expect(b.disabled, 'disabled should reach the <button>');
      t.expect(b.getAttribute('aria-label') === 'Send form', 'aria-label should reach the <button>');
      t.expect(b.title === 'Hint', 'title should reach the <button>');
    },
  },
  {
    id: 'onclick-works',
    run: async (t) => {
      await t.click(t.button('Delete'));
      t.expectText('#status', 'Account deleted');
      t.expect((t.button('Delete') as HTMLButtonElement).disabled, 'After deleting, the button should be disabled');
    },
  },
];
