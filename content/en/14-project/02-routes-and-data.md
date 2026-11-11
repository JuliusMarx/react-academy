---
title: Routes and Data
minutes: 10
summary: |-
  - The notes now live in `public/api/notes.json`. The dev server delivers the file like a GET endpoint; `api.ts` wraps `fetch` in `getNotes()` and `getNote(id)`.
  - Two pages in **Data Mode**: `/` shows the list, `/notes/:id` one note. `Layout` with `<Outlet />` is the shared parent route.
  - Data is loaded in **loaders** and read with `useLoaderData<typeof loader>()` – no Effect, no loading state per page. `useNavigation().state === 'loading'` shows a global hint.
  - The route objects live in `routes.tsx`; `App.tsx` only turns them into `createBrowserRouter(routes)`. That way tests can put the same routes into a memory router.
  - URL params are strings: `Number(params.id)`. If the note doesn't exist, the loader throws `data('Note not found', { status: 404 })` and the `errorElement` appears.
  - The search text stays local state in `NotesPage` – it belongs to this page, not to the data.

  ```tsx
  export async function noteLoader({ params }: LoaderFunctionArgs) {
    const note = await getNote(Number(params.id));
    if (!note) throw data('Note not found', { status: 404 });
    return note;
  }

  export const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, loader: notesLoader, element: <NotesPage /> },
        { path: 'notes/:id', loader: noteLoader, element: <NotePage />, errorElement: <ErrorPage /> },
      ],
    },
  ];
  ```
quiz:
  - question: "Someone opens `/notes/2` directly in the browser. Where does `NotePage` get the note from?"
    options: ["From a `useEffect` in `NotePage`","`noteLoader` runs before rendering with `params.id === '2'`, and `NotePage` reads the result with `useLoaderData()`","Nowhere – direct links only work with server rendering","From the state of `NotesPage`"]
    answer: 1
  - question: "Why does the loader say `Number(params.id)`?"
    options: ["Otherwise React Router throws an error","`params.id` is a promise","URL params are always strings – the IDs in the data are numbers","To make the URL shorter"]
    answer: 2
  - question: "`/notes/99` doesn't exist and the loader throws `data('Note not found', { status: 404 })`. What do you see?"
    options: ["An empty page","An error in the console, nothing else","The list of all notes","The route's `errorElement` – inside the layout, the navigation stays"]
    answer: 3
    explanation: "The detail route has its own `errorElement`. It appears in the `<Outlet />` of `Layout`. Without one, the parent route's would replace the whole layout."
---

# Routes and Data

So far the notes live in the code. In a real app they come from a server – and each note has its own address that you can share and bookmark. In this step the app gets both.

## Data from the “server”

As in the Data Fetching chapter, a JSON file sits in the project's `public` folder. The dev server delivers it at `/api/notes.json` – to the app it looks like a GET endpoint:

```json
[
  { "id": 1, "title": "Groceries", "body": "Milk, eggs, coffee", "pinned": true },
  { "id": 2, "title": "React ideas", "body": "Build a notes app with routing and forms.", "pinned": false }
]
```

Components don't call `fetch` themselves. `api.ts` does that – if the address changes later or a login is added, you only change this file:

```ts
// api.ts
export async function getNotes(): Promise<Note[]> {
  const res = await fetch('/api/notes.json');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<Note[]>;
}

export async function getNote(id: number): Promise<Note | null> {
  const notes = await getNotes();
  return notes.find((n) => n.id === id) ?? null;
}
```

`Note` and `matchesQuery` move to `api.ts` as well; `notes.ts` with the initial data goes away.

## The routes

Two pages, one shared frame – a case for nested routes and the Data Mode from the Routing chapter:

| Path | Component | Loader |
|---|---|---|
| `/` | `NotesPage` – search and list | `notesLoader` |
| `/notes/:id` | `NotePage` – one note | `noteLoader` |
| (both) | `Layout` – navigation and loading hint | – |

The routes and loaders live in `routes.tsx`:

```tsx
// routes.tsx
import { data, type LoaderFunctionArgs, type RouteObject } from 'react-router';

export async function notesLoader() {
  return getNotes();
}

export async function noteLoader({ params }: LoaderFunctionArgs) {
  const note = await getNote(Number(params.id));
  if (!note) throw data('Note not found', { status: 404 });
  return note;
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, loader: notesLoader, element: <NotesPage /> },
      { path: 'notes/:id', loader: noteLoader, element: <NotePage />, errorElement: <ErrorPage /> },
    ],
  },
];
```

`App.tsx` now only creates the router from them – once, outside the component:

```tsx
// App.tsx
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { routes } from './routes';

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
```

Why split it? In lesson 4 the tests put routes into a `createMemoryRouter` – without a browser URL and with their own test data.

## Layout and loading hint

`Layout` is the frame around both pages. `<Outlet />` shows the current child route, `useNavigation()` tells whether a loader is running:

```tsx
export default function Layout() {
  const navigation = useNavigation();
  return (
    <>
      <header>
        <nav>
          <Link to="/">All notes</Link>
        </nav>
        {navigation.state === 'loading' && <p>Loading …</p>}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

## The pages

`NotesPage` is almost the old `App`. Only now the notes come from the loader:

```tsx
import type { notesLoader } from './routes';

export default function NotesPage() {
  const notes = useLoaderData<typeof notesLoader>();
  const [query, setQuery] = useState('');

  const visible = notes
    .filter((n) => matchesQuery(n, query))
    .toSorted((a, b) => Number(b.pinned) - Number(a.pinned));
  // … search field, count, <NoteList notes={visible} />
}
```

`import type` only brings in the loader's type and disappears when compiling. So there's no import cycle at runtime, even though `routes.tsx` imports the pages. The search text stays local state: it belongs to this page, not to the data.

In `NoteList` each title becomes a `<Link>`. The Pin and Delete buttons are gone for now – you can't write to a static file. They come back in the next lesson, through the API.

```tsx
<li key={note.id}>
  {note.pinned && <span aria-hidden="true">📌 </span>}
  <Link to={`/notes/${note.id}`}>{note.title}</Link>
</li>
```

`NotePage` reads the note from its loader. There's no `null` case – the loader already turned that into a 404:

```tsx
export default function NotePage() {
  const note = useLoaderData<typeof noteLoader>();
  return (
    <article>
      <h1>{note.title}</h1>
      {note.pinned && <p>📌 Pinned</p>}
      <p>{note.body}</p>
      <Link to="/">Back to all notes</Link>
    </article>
  );
}
```

`ErrorPage` shows the error response with `useRouteError()` and `isRouteErrorResponse()`, e.g. “404 – Note not found”. Because the detail route has its own `errorElement`, the error appears inside the layout and the navigation stays.

::tryit{project-step-2}

> [!NOTE]
> In the Data Fetching chapter, `vite.config.ts` had `appType: 'mpa'` so that a missing JSON file returns a real 404. It's left out on purpose here: without the fallback to `index.html`, reloading `/notes/2` would fail. The loader detects missing notes itself. A hosted app with browser routing needs the same kind of rewrite from every path to `index.html`.

The next step adds writing: a form for new notes, and pinning and deleting on the detail page.
