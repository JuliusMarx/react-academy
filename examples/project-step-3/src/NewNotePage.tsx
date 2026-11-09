import { useNavigate } from 'react-router';
import { createNote, type NoteDraft } from './api';
import NoteForm from './NoteForm';

export default function NewNotePage() {
  const navigate = useNavigate();

  async function save(draft: NoteDraft) {
    const note = await createNote(draft);
    // The detail route's loader runs again and finds the new note
    await navigate(`/notes/${note.id}`);
  }

  return (
    <>
      <h1>New note</h1>
      <NoteForm onSave={save} />
    </>
  );
}
