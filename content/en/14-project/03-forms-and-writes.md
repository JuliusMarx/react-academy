---
title: Forms and Saving
minutes: 11
summary: |-
  - `api.ts` becomes a small fake server: it reads `notes.json` once, writes (`createNote`, `setPinned`, `deleteNote`) change a copy in memory – with an artificial delay, like over the network.
  - New route `notes/new` with `NewNotePage`: it saves through the API and then calls `await navigate(…)` to go to the new note – the detail page's loader finds it.
  - `NoteForm` uses `useActionState`: trim the input, validate it, return errors as state and show them in `<p role="alert">`. `isPending` disables the button.
  - React resets the form after **every** action – also after an error. So return the draft in the state and set it as `defaultValue`.
  - `NoteForm` gets `onSave` as a prop instead of calling the API itself. The form knows nothing about storage and navigation – and can be tested with a fake function.
  - After a change on the same page, the loader data is stale: `useRevalidator().revalidate()` runs the loaders again. `useTransition` gives the buttons a pending state.

  ```tsx
  async function save(_prev: State, formData: FormData): Promise<State> {
    const draft = { title: String(formData.get('title')).trim(), body: String(formData.get('body')).trim() };
    const error = validate(draft);
    if (error) return { error, draft };
    await onSave(draft);
    return empty;
  }

  const [state, formAction, isPending] = useActionState(save, empty);
  ```
quiz:
  - question: "Why does `NoteForm`'s action also return the `draft` when there's an error?"
    options: ["So React can show the error","React resets the fields after every action – with `defaultValue={state.draft.title}` the input is back afterwards","Because `useActionState` throws otherwise","For browser validation"]
    answer: 1
  - question: "`NotePage` calls `await setPinned(note.id, true)`. Why does the page still show the old state without `revalidator.revalidate()`?"
    options: ["Because `setPinned` is too slow","Because the browser caches the JSON file","`useLoaderData()` returns the data from the last loader run – only a new run fetches the changed state","Because the component has no state"]
    answer: 2
    explanation: "After a navigation, loaders run by themselves. If you stay on the same page, `useRevalidator().revalidate()` triggers them."
  - question: "Why does `NoteForm` get an `onSave` prop instead of calling `createNote` itself?"
    options: ["Otherwise `isPending` doesn't work","Props are faster than imports","`useActionState` can't call imports","The form stays independent of storage and navigation – reusable (e.g. for editing) and testable with a fake function"]
    answer: 3
exercise:
  example: ex-project-form
  title: The note form
  task: |-
    So far the form saves everything – even empty titles – and gives no feedback. Complete `NoteForm.tsx`:

    1. Trim the title and the text before you check and save them.
    2. Write `validate(draft)`: a title under 3 characters gives **The title needs at least 3 characters.**, one over 60 characters **The title can have at most 60 characters.**
    3. If there's an error, return it with the draft and don't call `onSave`.
    4. Show the error in `<p role="alert">` and set the input as `defaultValue` so it stays after an error.
    5. While saving, the button is disabled and shows **Saving …**.

    The checks render `NoteForm` on its own with a fake `onSave`. To try it in the app: **New note**.
  checks:
    validates-title: Too short and too long titles show the right error and aren't saved
    keeps-input: After an error, the title and the text are still in the form
    saves-trimmed: A valid note goes to `onSave` trimmed, without an error message
    pending: While saving, the button is disabled and shows **Saving …**
---

# Forms and Saving

The app can read – now it should write: create notes, pin them, delete them. That takes a server that accepts changes, a form with validation, and a way to refresh the displayed data afterwards.

## A fake server

You can't write to a static file. So `api.ts` becomes a small fake server, like in the examples of the previous chapters: it reads `notes.json` once, after that all functions work with a copy in memory. An artificial delay makes loading states visible.

```ts
// api.ts
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

export async function createNote(draft: NoteDraft): Promise<Note> {
  await wait(600);
  const all = await db();
  const note: Note = { id: Math.max(0, ...all.map((n) => n.id)) + 1, ...draft, pinned: false };
  notes = [...all, note];
  return note;
}

// getNotes, getNote, setPinned and deleteNote follow the same pattern
```

Nothing changes for the components: they keep calling `getNotes()` and friends. When a real server comes along, you only swap the functions in `api.ts` for `fetch` with `POST`, `PATCH` and `DELETE`. After a reload the changes are gone – they only lived in memory.

## A route for new notes

The form gets its own address. `routes.tsx` gets another child route, the layout a **New note** link:

```tsx
children: [
  { index: true, loader: notesLoader, element: <NotesPage /> },
  { path: 'notes/new', element: <NewNotePage /> },
  { path: 'notes/:id', loader: noteLoader, element: <NotePage />, errorElement: <ErrorPage /> },
],
```

Don't worry about the order: React Router ranks static segments like `new` above params like `:id`.

`NewNotePage` connects the form, the API and the navigation:

```tsx
export default function NewNotePage() {
  const navigate = useNavigate();

  async function save(draft: NoteDraft) {
    const note = await createNote(draft);
    await navigate(`/notes/${note.id}`);
  }

  return (
    <>
      <h1>New note</h1>
      <NoteForm onSave={save} />
    </>
  );
}
```

After the navigation, `noteLoader` runs and finds the new note. Go back to the list and `notesLoader` fetches it too – reloading data after a navigation is the router's job.

## The form

> [!TIP]
> Want to build the form yourself? Do the exercise at the end of the lesson first – this section and the live example show the solution.

`NoteForm` uses `useActionState` from the Forms chapter. The action gets the `FormData`, checks it and returns the next state:

```tsx
type State = { error: string | null; draft: NoteDraft };
const empty: State = { error: null, draft: { title: '', body: '' } };

function validate(draft: NoteDraft): string | null {
  if (draft.title.length < 3) return 'The title needs at least 3 characters.';
  if (draft.title.length > 60) return 'The title can have at most 60 characters.';
  return null;
}

export default function NoteForm({ onSave }: { onSave: (draft: NoteDraft) => Promise<void> }) {
  async function save(_prev: State, formData: FormData): Promise<State> {
    const draft = { title: String(formData.get('title')).trim(), body: String(formData.get('body')).trim() };
    const error = validate(draft);
    if (error) return { error, draft };
    try {
      await onSave(draft);
      return empty;
    } catch (e) {
      return { error: `Could not save the note: ${(e as Error).message}`, draft };
    }
  }

  const [state, formAction, isPending] = useActionState(save, empty);

  return (
    <form action={formAction}>
      <label>
        Title <input name="title" defaultValue={state.draft.title} />
      </label>
      <label>
        Text <textarea name="body" rows={4} defaultValue={state.draft.body} />
      </label>
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving …' : 'Save note'}
      </button>
    </form>
  );
}
```

The key decisions:

- **Trim before checking** – otherwise `"   "` would be a valid title.
- **Expected errors as state.** A title that's too short isn't a crash but a message. A failure while saving is caught and shown too.
- **`draft` in the state.** React resets the form after every action, also after an error. With `defaultValue` from the state, the input is back.
- **`role="alert"`** makes screen readers announce the message right away.
- **`onSave` as a prop.** The form doesn't know where things are saved or what happens next. The same component could edit a note – and in lesson 4 you test it with a fake function.

> [!TIP]
> `required` and `maxLength={60}` on the fields also give quick feedback in the browser. They don't replace the check in the action – that one applies however the data arrives.

## Pinning and deleting

The buttons return on the detail page, this time through the API. The problem: after `setPinned` you stay on the same page, and `useLoaderData()` keeps returning the data from the last loader run. `useRevalidator()` runs the loaders of the current page again:

```tsx
export default function NotePage() {
  const note = useLoaderData<typeof noteLoader>();
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isPending, startTransition] = useTransition();

  function togglePinned() {
    startTransition(async () => {
      await setPinned(note.id, !note.pinned);
      await revalidator.revalidate();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteNote(note.id);
      await navigate('/');
    });
  }

  // … <button onClick={togglePinned} disabled={isPending}>{note.pinned ? 'Unpin' : 'Pin'}</button>
}
```

Deleting needs no `revalidate` – navigating to the list runs `notesLoader` anyway. `useTransition` gives you `isPending` while the async function runs and disables the buttons against double clicks.

::tryit{project-step-3}

> [!NOTE]
> The Pin button only reacts after the fake server's delay. With `useOptimistic` from the Forms chapter it could switch immediately and jump back on an error – a good extension to build yourself.
