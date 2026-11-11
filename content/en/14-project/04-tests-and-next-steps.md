---
title: Tests and Next Steps
minutes: 10
summary: |-
  - Test behavior from the user's point of view: what's on the screen, what happens after typing and clicking – with `screen.getByRole`, `getByLabelText` and `userEvent`.
  - Test pages with loaders in a `createMemoryRouter` with `initialEntries` and **stub loaders** like `loader: () => notes`. No `fetch`, no fake server – the test decides the data.
  - Loaders are async: right after `render`, wait with `await screen.findBy…` until the page is there.
  - Test the form on its own, with `onSave = vi.fn(async () => {})`: `expect(onSave).not.toHaveBeenCalled()` for an error, `toHaveBeenCalledWith({ title, body })` for success.
  - The action runs asynchronously – `await waitFor(() => expect(…))` retries the assertion until it passes.
  - Ideas to extend the app: search in the URL (`useSearchParams`), an edit route with the same `NoteForm`, `useOptimistic` for pinning, focus after page changes, a real backend, Playwright tests.

  ```tsx
  const router = createMemoryRouter(
    [
      { path: '/', element: <NotesPage />, loader: () => notes },
      { path: '/notes/:id', element: <NotePage />, loader: ({ params }) => notes.find((n) => n.id === Number(params.id)) },
    ],
    { initialEntries: ['/'] },
  );
  render(<RouterProvider router={router} />);
  expect(await screen.findAllByRole('link')).toHaveLength(3);
  ```
quiz:
  - question: "Why do the tests use `createMemoryRouter` instead of `createBrowserRouter`?"
    options: ["`createBrowserRouter` doesn't work with TypeScript","Because tests can't contain links","It renders faster","The memory router keeps the URL in memory: each test starts on its own path with `initialEntries` and can bring its own stub loaders"]
    answer: 3
  - question: "Why is there an `await screen.findAllByRole('link')` right after `render` instead of `getAllByRole`?"
    options: ["The loader runs asynchronously – `find…` waits until the links appear, `get…` would fail immediately","`findAll…` finds more elements","Because `render` returns a promise","`getAllByRole` doesn't exist"]
    answer: 0
  - question: "How do you check that `NoteForm` doesn't save a title that's too short?"
    options: ["Call `createNote` in the test and read the JSON file","Render it with `onSave = vi.fn()`, submit, then `expect(onSave).not.toHaveBeenCalled()` – and check the message with `findByRole('alert')`","You don't, the browser checks it with `required`","With a snapshot of the form"]
    answer: 1
exercise:
  example: ex-project-tests
  title: Tests for the Note Form
  task: |-
    In `NoteForm.test.tsx`, write at least two tests for the form from the last lesson. `onSave` is a fake function each time: `vi.fn(async (_draft: NoteDraft) => {})`.

    1. A title that's too short (e.g. **Hi**) shows an error message (role `alert`) – and `onSave` is **not** called.
    2. A valid note calls `onSave` with the title **and** the text, e.g. `{ title: 'Groceries', body: 'Milk, eggs' }`.

    Find the fields with `screen.getByLabelText('Title')` and `getByLabelText('Text')`, the button with `getByRole('button', { name: 'Save note' })`. The checks also run your tests against broken versions of the form – good tests fail there.
  checks:
    tests-pass: At least two tests, all passing
    catches-validation: The tests notice when a short title gets saved anyway
    catches-message: The tests notice when the error message is missing
    catches-body: The tests notice when the text isn't saved
---

# Tests and Next Steps

The app works. To keep it that way while you extend it, it gets tests. As in the Testing chapter, they check behavior from the user's point of view – not which hooks or state a component has internally.

## What to test?

| Part | What matters | How |
|---|---|---|
| `NotesPage` | Pinned first, search filters, a link leads to the note | Memory router with stub loaders |
| `NoteForm` | Validation, message, what gets saved | Render on its own, `onSave` as `vi.fn()` |
| `api.ts` | Fake server – in a real app, the server itself | Not here; otherwise its own tests or Playwright |

## Testing pages with loaders

`NotesPage` reads its data with `useLoaderData()` – without a router context it would crash. A `createMemoryRouter` keeps the URL in memory instead of the address bar. With `initialEntries` each test starts on its own path, and the loaders can be stubs that simply return test data:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

const notes: Note[] = [
  { id: 1, title: 'Groceries', body: 'Milk, eggs', pinned: false },
  { id: 2, title: 'Dentist', body: 'Monday morning', pinned: true },
  { id: 3, title: 'Ideas', body: 'A notes app with milk delivery', pinned: false },
];

function renderNotes() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <NotesPage />, loader: () => notes },
      { path: '/notes/:id', element: <NotePage />, loader: ({ params }) => notes.find((n) => n.id === Number(params.id)) },
    ],
    { initialEntries: ['/'] },
  );
  render(<RouterProvider router={router} />);
}
```

Why not the real `routes` with a mocked `fetch`? That would work – but the fake server remembers the notes after the first load, so one test would see the previous test's data. Stub loaders keep every test independent, and the test data is right there in the test.

The tests themselves:

```tsx
it('lists pinned notes first', async () => {
  renderNotes();

  // findBy… waits until the loader has finished
  const links = await screen.findAllByRole('link');
  expect(links.map((l) => l.textContent)).toEqual(['Dentist', 'Groceries', 'Ideas']);
});

it('filters by title and text', async () => {
  const user = userEvent.setup();
  renderNotes();

  await user.type(await screen.findByLabelText('Search'), 'milk');

  expect(screen.getAllByRole('link')).toHaveLength(2);
  expect(screen.getByText('2 of 3 notes')).toBeInTheDocument();
});

it('opens a note', async () => {
  const user = userEvent.setup();
  renderNotes();

  await user.click(await screen.findByRole('link', { name: 'Groceries' }));

  expect(await screen.findByRole('heading', { name: 'Groceries' })).toBeInTheDocument();
});
```

The third test clicks a real `<Link>` – the memory router navigates, the detail page's stub loader runs, and the real `NotePage` shows the note.

::tryit{project-tests}

## Testing the form

`NoteForm` needs no router: it gets `onSave` as a prop. In the test that's a `vi.fn()` that records every call:

```tsx
const onSave = vi.fn(async (_draft: NoteDraft) => {});
render(<NoteForm onSave={onSave} />);

await user.type(screen.getByLabelText('Title'), 'Groceries');
await user.click(screen.getByRole('button', { name: 'Save note' }));

// The action runs asynchronously – waitFor retries until the expectation holds
await waitFor(() => expect(onSave).toHaveBeenCalledWith({ title: 'Groceries', body: '' }));
```

This is where the decision from the last lesson pays off: because the form doesn't save or navigate by itself, it's testable in three lines. In the exercise you write the tests for it.

## Looking back

| Building block | Where in the project | Chapter |
|---|---|---|
| Components, props, callbacks | `NoteList`, `NoteItem` | JSX & Components |
| Minimal state, derived values | Search, sorting, count | State |
| Loading data, `api.ts` | `getNotes`, `getNote` | Data Fetching |
| Routes, params, loaders, `errorElement` | `routes.tsx` | Routing |
| `useActionState`, validation | `NoteForm` | Forms & Actions |
| `useTransition` | Pinning and deleting | Advanced |
| `aria-label`, `role="alert"` | Buttons, error message | Accessibility |
| Testing Library, `vi.fn` | `NotesPage.test.tsx`, `NoteForm.test.tsx` | Testing |

## Where to go from here

The app is deliberately small. Ideas to extend it – each one practices a topic from the course:

- **Search in the URL:** with `useSearchParams` the search text lives in `/?q=milk` – shareable and still there after the back button.
- **Editing notes:** a route `notes/:id/edit` that reuses `NoteForm` with initial values.
- **Instant pinning:** `useOptimistic` switches the button before the server answers.
- **Focus after page changes:** focus the new page's heading, as in the Accessibility chapter.
- **A real backend:** swap `api.ts` for `fetch` with `POST`/`PATCH`/`DELETE` – or use TanStack Query for caching and refetching.
- **End-to-end tests:** check the whole flow “create a note, find it in the list, delete it” in a real browser with Playwright.

> [!TIP]
> Start a new project (`npm create vite@latest`, template “React + TypeScript”) and rebuild the app without looking. Wherever you get stuck, you know which lesson to revisit.
