import { useTransition } from 'react';
import { Link, useLoaderData, useNavigate, useRevalidator } from 'react-router';
import { deleteNote, setPinned } from './api';
import type { noteLoader } from './routes';

export default function NotePage() {
  const note = useLoaderData<typeof noteLoader>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isPending, startTransition] = useTransition();

  function togglePinned() {
    startTransition(async () => {
      await setPinned(note.id, !note.pinned);
      // Runs the loaders of the current page again – the page shows the saved state
      await revalidator.revalidate();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteNote(note.id);
      await navigate('/');
    });
  }

  return (
    <article>
      <h1>{note.title}</h1>
      {note.pinned && <p>📌 Pinned</p>}
      <p>{note.body}</p>
      <button onClick={togglePinned} disabled={isPending}>
        {note.pinned ? 'Unpin' : 'Pin'}
      </button>
      <button onClick={remove} disabled={isPending}>
        Delete
      </button>
      <p>
        <Link to="/">Back to all notes</Link>
      </p>
    </article>
  );
}
