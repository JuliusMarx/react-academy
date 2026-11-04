import type { Check } from './check-kit';

export const exercise = 'ex-focus';

const input = (t: Parameters<Check['run']>[0]) => t.$('#text') as HTMLInputElement;

export const checks: Check[] = [
  {
    id: 'focus-button',
    run: async (t) => {
      (document.activeElement as HTMLElement | null)?.blur();
      await t.click(t.button('Focus'));
      t.expect(document.activeElement === input(t), 'After clicking Focus, the input should have the focus');
    },
  },
  {
    id: 'send',
    run: async (t) => {
      await t.click(t.button('Send'));
      t.expectText('#message', 'Hello');
    },
  },
  {
    id: 'clear',
    run: async (t) => {
      (document.activeElement as HTMLElement | null)?.blur();
      await t.click(t.button('Clear'));
      t.expect(input(t).value === '', `After Clear the input should be empty, it contains "${input(t).value}"`);
      t.expect(document.activeElement === input(t), 'After Clear the input should have the focus');
    },
  },
];
