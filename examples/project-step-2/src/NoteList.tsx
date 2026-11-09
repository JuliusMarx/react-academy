import { Link } from 'react-router';
import type { Note } from './api';

export default function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) return <p>No notes found.</p>;
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          {note.pinned && <span aria-hidden="true">📌 </span>}
          <Link to={`/notes/${note.id}`}>{note.title}</Link>
        </li>
      ))}
      <li>
        <Link to="/notes/99">A note that doesn't exist</Link>
      </li>
    </ul>
  );
}
