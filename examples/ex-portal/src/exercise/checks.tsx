import type { Check } from './check-kit';

export const exercise = 'ex-portal';

const dialog = () => document.querySelector<HTMLElement>('[role=dialog]');

export const checks: Check[] = [
  {
    id: 'renders-in-body',
    run: async (t) => {
      await t.click(t.button('Open dialog'));
      const d = dialog();
      t.expect(d, 'Clicking "Open dialog" should show the dialog');
      t.expect(!document.getElementById('root')!.contains(d), 'The dialog is still inside #root – render it into document.body with createPortal');
      t.expect(d!.parentElement === document.body || d!.closest('body > *:not(#root)'), 'The dialog should be rendered into document.body');
    },
  },
  {
    id: 'close-button',
    run: async (t) => {
      const close = [...(dialog()?.querySelectorAll('button') ?? [])].find((b) => b.textContent === 'Close');
      t.expect(close, 'The dialog should have a Close button');
      await t.click(close!);
      t.expect(!dialog(), 'After clicking Close the dialog should be gone');
    },
  },
  {
    id: 'escape-closes',
    run: async (t) => {
      await t.click(t.button('Open dialog'));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await t.settle();
      t.expect(!dialog(), 'Pressing Escape should close the dialog');
    },
  },
];
