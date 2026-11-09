import { Link, useLoaderData } from 'react-router';
import type { noteLoader } from './routes';

export default function NotePage() {
  const note = useLoaderData<typeof noteLoader>();
  return (
    <article>
      <h1>{note.title}</h1>
      {note.pinned && <p>📌 Pinned</p>}
      <p>{note.body}</p>
      <Link to="/">Back to all notes</Link>
    </article>
  );
}
