---
title: Plan, Components and State
minutes: 9
summary: |-
  - The project: a notes app in four steps – components and state, routes and loading, form and saving, tests. Each lesson builds on the previous one.
  - Plan first: split the UI into components (`App` → `NoteList` → `NoteItem`), then look for the **minimal state**.
  - State is just the notes and the search text. The filtered, sorted list and the count are computed during rendering.
  - Never mutate state: `map` with `{ ...n, pinned: !n.pinned }` to change a note, `filter` to delete one.
  - Data flows down as props, events flow up as callbacks (`onTogglePinned`, `onDelete`) – the state stays in `App`.
  - Lists get `key={note.id}`, repeated buttons an `aria-label` that says which note they belong to.

  ```tsx
  const [notes, setNotes] = useState(initialNotes);
  const [query, setQuery] = useState('');

  const visible = notes
    .filter((n) => matchesQuery(n, query))
    .toSorted((a, b) => Number(b.pinned) - Number(a.pinned));

  function togglePinned(id: number) {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }
  ```
quiz:
  - question: "What belongs in state in the notes app?"
    options: ["The number of matches","The notes, the search text and the filtered list","Only the filtered list","The notes and the search text"]
    answer: 3
    explanation: "The filtered list and the count can be computed from the notes and the search text at any time. As separate state you'd have to keep them in sync with every change."
  - question: "Why `setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))` instead of `note.pinned = !note.pinned`?"
    options: ["React compares references – only a new array with a new object signals a change. A mutated original doesn't reliably re-render","`map` is faster","TypeScript forbids assigning to props","Because `pinned` is read-only"]
    answer: 0
  - question: "Which `key` does `NoteItem` get in the list?"
    options: ["The index from `map`","`note.id`","`Math.random()`","`note.title`"]
    answer: 1
    explanation: "The list gets sorted, filtered and shortened – the index moves around. The ID stays stable and is unique; titles can repeat."
---

# Plan, Components and State

In this chapter you build a small notes app – not example by example, but as **one** project that grows with every lesson. Almost everything you've learned so far comes up:

| Step | What the app can do afterwards | From chapter |
|---|---|---|
| 1. Components and state | Show, search, pin and delete notes | JSX & Components, State |
| 2. Routes and data | List and detail page, data from a JSON file | Data Fetching, Routing |
| 3. Forms and saving | New notes with validation, pinning and deleting through the API | Forms & Actions |
| 4. Testing | Tests for the list and the form | Testing |

Each lesson ends with the complete state of the project as a live example. So you can jump in at any point – or keep building your own version.

## Plan first

Before writing code, take a look at the finished UI. For the first step: a heading, a search field, a line "2 of 3 notes" and the list. Each note has a title, a text and two buttons.

That gives you the components:

```text
App               search field, count, state
└─ NoteList       the list – or "No notes found."
   └─ NoteItem    one note with a Pin and a Delete button
```

The rule from the State chapter: find the **minimal** state first, compute everything else.

| Data | State? | Why |
|---|---|---|
| The notes | Yes | Change when pinning and deleting |
| The search text | Yes | Changes when typing |
| The filtered, sorted list | No | Can be computed from notes and search text |
| "2 of 3 notes" | No | Two lengths – computable |

## The data

The type and the initial data live in a file of their own. The search is a small pure function – every step needs it:

```ts
// notes.ts
export type Note = { id: number; title: string; body: string; pinned: boolean };

export const initialNotes: Note[] = [
  { id: 1, title: 'Groceries', body: 'Milk, eggs, coffee', pinned: true },
  // …
];

export function matchesQuery(note: Note, query: string): boolean {
  const q = query.trim().toLowerCase();
  return note.title.toLowerCase().includes(q) || note.body.toLowerCase().includes(q);
}
```

## The state in App

`App` holds the two state values and computes what to show during rendering:

```tsx
export default function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [query, setQuery] = useState('');

  // Computed during rendering – pinned notes first
  const visible = notes
    .filter((n) => matchesQuery(n, query))
    .toSorted((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <main>
      <h1>Notes</h1>
      <label>
        Search <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <p>{visible.length} of {notes.length} notes</p>
      <NoteList notes={visible} onTogglePinned={togglePinned} onDelete={deleteNote} />
    </main>
  );
}
```

`toSorted` returns a new array – `sort` would sort the array in place, and here that would be the state itself. You don't need `useMemo`: filtering three notes costs nothing.

## Changing without mutating

Pinning and deleting each create a new array. The changed note becomes a new object, all others stay as they are:

```tsx
function togglePinned(id: number) {
  setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
}

function deleteNote(id: number) {
  setNotes(notes.filter((n) => n.id !== id));
}
```

## Props down, events up

`NoteList` and `NoteItem` have no state of their own. They get the data as props and report clicks upwards through callbacks – `App` decides what happens:

```tsx
export default function NoteItem({ note, onTogglePinned, onDelete }: Props) {
  return (
    <li>
      <h2>
        {note.pinned && <span aria-hidden="true">📌 </span>}
        {note.title}
      </h2>
      <p>{note.body}</p>
      <button aria-label={`${note.pinned ? 'Unpin' : 'Pin'} “${note.title}”`} onClick={() => onTogglePinned(note.id)}>
        {note.pinned ? 'Unpin' : 'Pin'}
      </button>
      <button aria-label={`Delete “${note.title}”`} onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </li>
  );
}
```

Two details from the Accessibility chapter: every note has a "Delete" button. To a screen reader they all sound the same – the `aria-label` says which note is meant. And the 📌 is decoration (`aria-hidden`); the button text "Unpin" says the same thing.

In `NoteList`, each `NoteItem` gets `key={note.id}`. The index would be wrong: the list gets sorted, filtered and shortened.

::tryit{project-step-1}

> [!TIP]
> Try it: pin "React ideas" – the note moves up. Search for "milk" and delete the note – the count is right immediately, because it's computed.

In the next lesson the app gets a detail page per note, and the data no longer comes from the code but from the "server".
