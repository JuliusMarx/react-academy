import { useActionState } from 'react';
import type { NoteDraft } from './api';

type State = { error: string | null; draft: NoteDraft };

const empty: State = { error: null, draft: { title: '', body: '' } };

// TODO 1: Write validate(draft) – it returns an error message or null:
//   - title shorter than 3 characters → "The title needs at least 3 characters."
//   - title longer than 60 characters → "The title can have at most 60 characters."

export default function NoteForm({ onSave }: { onSave: (draft: NoteDraft) => Promise<void> }) {
  async function save(_prev: State, formData: FormData): Promise<State> {
    // TODO 2: Trim title and body – leading and trailing spaces don't count
    const draft = { title: String(formData.get('title')), body: String(formData.get('body')) };
    // TODO 3: Validate – with an error, return it together with the draft and don't save
    await onSave(draft);
    return empty;
  }

  // TODO 5: useActionState also returns isPending as the third value
  const [, formAction] = useActionState(save, empty);

  return (
    <form action={formAction}>
      <p>
        <label>
          {/* TODO 4: Show the entered values again after an error (defaultValue) */}
          Title <input name="title" />
        </label>
      </p>
      <p>
        <label>
          Text <textarea name="body" rows={4} />
        </label>
      </p>
      {/* TODO 4: Show the error in <p role="alert"> */}
      {/* TODO 5: Disable the button and show "Saving …" while saving */}
      <button type="submit">Save note</button>
    </form>
  );
}
