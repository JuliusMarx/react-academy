export type Note = { id: number; title: string; body: string; pinned: boolean };

// The notes come from public/api/notes.json – a static file that the dev server
// delivers like a GET endpoint of a real API.
export async function getNotes(): Promise<Note[]> {
  const res = await fetch('/api/notes.json');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Note[]>;
}

export async function getNote(id: number): Promise<Note | null> {
  const notes = await getNotes();
  return notes.find((n) => n.id === id) ?? null;
}

/** Does the note contain the search text – in its title or its body? */
export function matchesQuery(note: Note, query: string): boolean {
  const q = query.trim().toLowerCase();
  return note.title.toLowerCase().includes(q) || note.body.toLowerCase().includes(q);
}
