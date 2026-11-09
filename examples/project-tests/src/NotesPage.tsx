import { useState } from 'react';
import { useLoaderData } from 'react-router';
import { matchesQuery } from './api';
import NoteList from './NoteList';
import type { notesLoader } from './routes';

export default function NotesPage() {
  // The loader has already fetched the notes – no effect, no loading state
  const notes = useLoaderData<typeof notesLoader>();
  const [query, setQuery] = useState('');

  const visible = notes.filter((n) => matchesQuery(n, query)).toSorted((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <>
      <h1>Notes</h1>
      <label>
        Search <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <p>
        {visible.length} of {notes.length} notes
      </p>
      <NoteList notes={visible} />
    </>
  );
}
