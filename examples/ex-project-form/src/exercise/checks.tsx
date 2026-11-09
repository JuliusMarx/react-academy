import type { Check, TestKit } from './check-kit';
import type { NoteDraft } from '../api';
import NoteForm from '../NoteForm';

export const exercise = 'ex-project-form';

/** Renders the form on its own with a fake onSave that records every draft it gets. */
async function renderForm(t: TestKit, delay = 0) {
  const saved: NoteDraft[] = [];
  const onSave = async (draft: NoteDraft) => {
    await new Promise((r) => setTimeout(r, delay));
    saved.push(draft);
  };
  const view = await t.render(<NoteForm onSave={onSave} />);
  const field = (name: string) => view.$(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement;
  return { view, saved, field };
}

export const checks: Check[] = [
  {
    id: 'validates-title',
    run: async (t) => {
      const { view, saved, field } = await renderForm(t);
      await view.type(field('title'), 'Hi');
      await view.click(view.$('button'));
      await view.eventually(() => view.expectText('[role="alert"]', 'at least 3 characters'));
      t.expect(saved.length === 0, 'A note with the title "Hi" should not be saved');

      await view.type(field('title'), 'x'.repeat(61));
      await view.click(view.$('button'));
      await view.eventually(() => view.expectText('[role="alert"]', 'at most 60 characters'));
      t.expect(saved.length === 0, 'A note with a 61-character title should not be saved');
    },
  },
  {
    id: 'keeps-input',
    run: async (t) => {
      const { view, field } = await renderForm(t);
      await view.type(field('title'), 'Hi');
      await view.type(field('body'), 'Buy milk');
      await view.click(view.$('button'));
      await view.eventually(() => view.$('[role="alert"]'));
      const title = field('title').value;
      const body = field('body').value;
      t.expect(
        title === 'Hi' && body === 'Buy milk',
        `After the error the form should still show "Hi" and "Buy milk", it shows "${title}" and "${body}"`,
      );
    },
  },
  {
    id: 'saves-trimmed',
    run: async (t) => {
      const { view, saved, field } = await renderForm(t);
      await view.type(field('title'), '  Groceries  ');
      await view.type(field('body'), ' Milk, eggs ');
      await view.click(view.$('button'));
      await view.eventually(() => t.expect(saved.length === 1, 'onSave should be called once for a valid note'));
      t.expect(
        saved[0].title === 'Groceries' && saved[0].body === 'Milk, eggs',
        `onSave should get the trimmed values { title: "Groceries", body: "Milk, eggs" }, it got ${JSON.stringify(saved[0])}`,
      );
      t.expect(view.$$('[role="alert"]').length === 0, 'A valid note should not show an error');
    },
  },
  {
    id: 'pending',
    run: async (t) => {
      const { view, saved, field } = await renderForm(t, 600);
      await view.type(field('title'), 'Dentist');
      await view.click(view.$('button'));
      const button = view.$('button') as HTMLButtonElement;
      t.expect(button.disabled, 'While saving, the button should be disabled');
      view.expectText('button', 'Saving');
      await view.eventually(() =>
        t.expect(saved.length === 1 && !button.disabled, 'After saving, the button should be enabled again'),
      );
    },
  },
];
