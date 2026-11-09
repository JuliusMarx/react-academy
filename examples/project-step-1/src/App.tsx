import { useState } from 'react';
import NoteList from './NoteList';
import { initialNotes, matchesQuery, type Note } from './notes';

export default function App() {
  // The only state: the notes and the search text. Everything else is derived.
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [query, setQuery] = useState('');

  // Computed during rendering – pinned notes first
  const visible = notes.filter((n) => matchesQuery(n, query)).toSorted((a, b) => Number(b.pinned) - Number(a.pinned));

  function togglePinned(id: number) {
    // New array, new object for the changed note – never mutate state
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }

  function deleteNote(id: number) {
    setNotes(notes.filter((n) => n.id !== id));
  }

  return (
    <main>
      <h1>Notes</h1>
      <label>
        Search <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <p>
        {visible.length} of {notes.length} notes
      </p>
      <NoteList notes={visible} onTogglePinned={togglePinned} onDelete={deleteNote} />
    </main>
  );
}
