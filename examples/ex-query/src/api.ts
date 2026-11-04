// A fake server – you don't need to change this file.
export type Note = { id: number; text: string };

let notes: Note[] = [
  { id: 1, text: 'Buy milk' },
  { id: 2, text: 'Call Ada' },
];
let nextId = 3;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchNotes(): Promise<Note[]> {
  await wait(300);
  return notes;
}

export async function addNote(text: string): Promise<Note> {
  await wait(200);
  const note = { id: nextId++, text };
  notes = [...notes, note];
  return note;
}
