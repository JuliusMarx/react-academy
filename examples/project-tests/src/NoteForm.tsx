import { useActionState } from 'react';
import type { NoteDraft } from './api';

type State = { error: string | null; draft: NoteDraft };

const empty: State = { error: null, draft: { title: '', body: '' } };

function validate(draft: NoteDraft): string | null {
  if (draft.title.length < 3) return 'The title needs at least 3 characters.';
  if (draft.title.length > 60) return 'The title can have at most 60 characters.';
  return null;
}

// The form doesn't know where notes are stored – it hands a valid draft to onSave.
export default function NoteForm({ onSave }: { onSave: (draft: NoteDraft) => Promise<void> }) {
  async function save(_prev: State, formData: FormData): Promise<State> {
    const draft = { title: String(formData.get('title')).trim(), body: String(formData.get('body')).trim() };
    const error = validate(draft);
    // React resets the fields after every action – the draft brings the values back
    if (error) return { error, draft };
    try {
      await onSave(draft);
      return empty;
    } catch (e) {
      return { error: `Could not save the note: ${(e as Error).message}`, draft };
    }
  }

  const [state, formAction, isPending] = useActionState(save, empty);

  return (
    <form action={formAction}>
      <p>
        <label>
          Title <input name="title" defaultValue={state.draft.title} />
        </label>
      </p>
      <p>
        <label>
          Text <textarea name="body" rows={4} defaultValue={state.draft.body} />
        </label>
      </p>
      {state.error && (
        <p role="alert" style={{ color: 'crimson' }}>
          {state.error}
        </p>
      )}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving …' : 'Save note'}
      </button>
    </form>
  );
}
