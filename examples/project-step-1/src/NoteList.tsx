import NoteItem from './NoteItem';
import type { Note } from './notes';

type Props = {
  notes: Note[];
  onTogglePinned: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function NoteList({ notes, onTogglePinned, onDelete }: Props) {
  if (notes.length === 0) return <p>No notes found.</p>;
  return (
    <ul>
      {notes.map((note) => (
        // A stable key from the data – not the index, notes get sorted and deleted
        <NoteItem key={note.id} note={note} onTogglePinned={onTogglePinned} onDelete={onDelete} />
      ))}
    </ul>
  );
}
