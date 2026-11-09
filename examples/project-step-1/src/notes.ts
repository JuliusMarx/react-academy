export type Note = { id: number; title: string; body: string; pinned: boolean };

export const initialNotes: Note[] = [
  { id: 1, title: 'Groceries', body: 'Milk, eggs, coffee', pinned: true },
  { id: 2, title: 'React ideas', body: 'Build a notes app with routing and forms.', pinned: false },
  { id: 3, title: 'Call the dentist', body: 'Monday morning – ask about Friday.', pinned: false },
];

/** Does the note contain the search text – in its title or its body? */
export function matchesQuery(note: Note, query: string): boolean {
  const q = query.trim().toLowerCase();
  return note.title.toLowerCase().includes(q) || note.body.toLowerCase().includes(q);
}
