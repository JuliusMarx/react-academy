import type { Note } from './notes';

type Props = {
  note: Note;
  onTogglePinned: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function NoteItem({ note, onTogglePinned, onDelete }: Props) {
  return (
    <li>
      <h2>
        {note.pinned && <span aria-hidden="true">📌 </span>}
        {note.title}
      </h2>
      <p>{note.body}</p>
      {/* Every note has these buttons – the aria-label says which note they belong to */}
      <button aria-label={`${note.pinned ? 'Unpin' : 'Pin'} “${note.title}”`} onClick={() => onTogglePinned(note.id)}>
        {note.pinned ? 'Unpin' : 'Pin'}
      </button>
      <button aria-label={`Delete “${note.title}”`} onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </li>
  );
}
