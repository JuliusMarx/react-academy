// Deliberately broken versions of NoteForm – your tests should notice each of them.
import { useActionState } from 'react';
import type { NoteDraft } from '../api';

type Props = { onSave: (draft: NoteDraft) => Promise<void> };

/** A NoteForm whose action is replaced – everything else looks the same. */
function brokenForm(action: (formData: FormData, onSave: Props['onSave']) => Promise<string | null>) {
  return function NoteForm({ onSave }: Props) {
    const [error, formAction, isPending] = useActionState(
      (_prev: string | null, formData: FormData) => action(formData, onSave),
      null,
    );
    return (
      <form action={formAction}>
        <p>
          <label>
            Title <input name="title" />
          </label>
        </p>
        <p>
          <label>
            Text <textarea name="body" rows={4} />
          </label>
        </p>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? 'Saving …' : 'Save note'}
        </button>
      </form>
    );
  };
}

const draftOf = (formData: FormData) => ({
  title: String(formData.get('title')).trim(),
  body: String(formData.get('body')).trim(),
});

/** Saves every note, even one without a title. */
const NoValidation = brokenForm(async (formData, onSave) => {
  await onSave(draftOf(formData));
  return null;
});

/** Refuses short titles – but silently, without an error message. */
const NoErrorMessage = brokenForm(async (formData, onSave) => {
  const draft = draftOf(formData);
  if (draft.title.length >= 3) await onSave(draft);
  return null;
});

/** Validates correctly, but forgets the text when saving. */
const DropsBody = brokenForm(async (formData, onSave) => {
  const draft = draftOf(formData);
  if (draft.title.length < 3) return 'The title needs at least 3 characters.';
  await onSave({ title: draft.title, body: '' });
  return null;
});

export const mutants = {
  NoValidation: { NoteForm: NoValidation },
  NoErrorMessage: { NoteForm: NoErrorMessage },
  DropsBody: { NoteForm: DropsBody },
};
