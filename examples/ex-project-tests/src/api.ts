// A small fake server. Reading starts with public/api/notes.json; writes only change a copy in
// memory (a static file can't be written to), so they are gone after a reload.
export type Note = { id: number; title: string; body: string; pinned: boolean };
export type NoteDraft = { title: string; body: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
let notes: Note[] | null = null;

async function db(): Promise<Note[]> {
  if (!notes) {
    const res = await fetch('/api/notes.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    notes = (await res.json()) as Note[];
  }
  return notes;
}

export async function getNotes(): Promise<Note[]> {
  await wait(300);
  return db();
}

export async function getNote(id: number): Promise<Note | null> {
  await wait(300);
  return (await db()).find((n) => n.id === id) ?? null;
}

export async function createNote(draft: NoteDraft): Promise<Note> {
  await wait(600);
  const all = await db();
  const note: Note = { id: Math.max(0, ...all.map((n) => n.id)) + 1, ...draft, pinned: false };
  notes = [...all, note];
  return note;
}

export async function setPinned(id: number, pinned: boolean): Promise<void> {
  await wait(400);
  notes = (await db()).map((n) => (n.id === id ? { ...n, pinned } : n));
}

export async function deleteNote(id: number): Promise<void> {
  await wait(400);
  notes = (await db()).filter((n) => n.id !== id);
}

/** Does the note contain the search text – in its title or its body? */
export function matchesQuery(note: Note, query: string): boolean {
  const q = query.trim().toLowerCase();
  return note.title.toLowerCase().includes(q) || note.body.toLowerCase().includes(q);
}
