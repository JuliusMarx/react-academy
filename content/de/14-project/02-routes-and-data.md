---
title: Routen und Daten laden
minutes: 10
summary: |-
  - Die Notizen liegen jetzt in `public/api/notes.json`. Der Dev-Server liefert die Datei aus wie einen GET-Endpunkt; `api.ts` kapselt `fetch` in `getNotes()` und `getNote(id)`.
  - Zwei Seiten im **Data Mode**: `/` zeigt die Liste, `/notes/:id` eine Notiz. `Layout` mit `<Outlet />` ist die gemeinsame Eltern-Route.
  - Geladen wird in **Loadern**, gelesen mit `useLoaderData<typeof loader>()` – kein Effekt, kein Ladezustand pro Seite. `useNavigation().state === 'loading'` zeigt einen globalen Hinweis.
  - Die Route-Objekte stehen in `routes.tsx`, `App.tsx` macht daraus nur `createBrowserRouter(routes)`. So können Tests dieselben Routen in einen Memory-Router stecken.
  - URL-Parameter sind Strings: `Number(params.id)`. Gibt es die Notiz nicht, wirft der Loader `data('Note not found', { status: 404 })` und das `errorElement` erscheint.
  - Der Suchtext bleibt lokaler State in `NotesPage` – er gehört zu dieser Seite, nicht zu den Daten.

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
  - question: "Jemand öffnet `/notes/2` direkt im Browser. Woher bekommt `NotePage` die Notiz?"
    options: ["Aus einem `useEffect` in `NotePage`","Der `noteLoader` läuft vor dem Rendern mit `params.id === '2'`, `NotePage` liest das Ergebnis mit `useLoaderData()`","Gar nicht – direkte Links funktionieren nur mit Server-Rendering","Aus dem State von `NotesPage`"]
    answer: 1
  - question: "Warum steht im Loader `Number(params.id)`?"
    options: ["Sonst wirft React Router einen Fehler","`params.id` ist ein Promise","URL-Parameter sind immer Strings – die IDs in den Daten sind Zahlen","Damit die URL kürzer wird"]
    answer: 2
  - question: "`/notes/99` gibt es nicht und der Loader wirft `data('Note not found', { status: 404 })`. Was sieht man?"
    options: ["Eine leere Seite","Eine Fehlermeldung in der Konsole, sonst nichts","Die Liste aller Notizen","Das `errorElement` der Route – innerhalb des Layouts, die Navigation bleibt stehen"]
    answer: 3
    explanation: "Die Detail-Route hat ein eigenes `errorElement`. Es erscheint im `<Outlet />` von `Layout`. Ohne eigenes würde das der Eltern-Route das ganze Layout ersetzen."
---

# Routen und Daten laden

Bisher stehen die Notizen im Code. In einer echten App kommen sie von einem Server – und jede Notiz hat eine eigene Adresse, die man teilen und als Lesezeichen speichern kann. In diesem Schritt bekommt die App beides.

## Daten vom „Server“

Wie im Kapitel „Daten laden“ liegt eine JSON-Datei im `public`-Ordner des Projekts. Der Dev-Server liefert sie unter `/api/notes.json` aus – für die App sieht das aus wie ein GET-Endpunkt:

```json
[
  { "id": 1, "title": "Groceries", "body": "Milk, eggs, coffee", "pinned": true },
  { "id": 2, "title": "React ideas", "body": "Build a notes app with routing and forms.", "pinned": false }
]
```

Komponenten rufen `fetch` nicht selbst auf. Das übernimmt `api.ts` – wechselt später die Adresse oder kommt ein Login dazu, änderst du nur diese Datei:

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

`Note` und `matchesQuery` ziehen mit nach `api.ts` um, `notes.ts` mit den Startdaten fällt weg.

## Die Routen

Zwei Seiten, ein gemeinsamer Rahmen – das ist der Fall für verschachtelte Routen und den Data Mode aus dem Routing-Kapitel:

| Pfad | Komponente | Loader |
|---|---|---|
| `/` | `NotesPage` – Suche und Liste | `notesLoader` |
| `/notes/:id` | `NotePage` – eine Notiz | `noteLoader` |
| (beide) | `Layout` – Navigation und Ladehinweis | – |

Die Routen und Loader stehen in `routes.tsx`:

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

`App.tsx` erzeugt daraus nur noch den Router – einmal, außerhalb der Komponente:

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

Warum die Trennung? In Lektion 4 stecken die Tests Routen in einen `createMemoryRouter` – ohne Browser-URL und mit eigenen Testdaten.

## Layout und Ladehinweis

`Layout` ist der Rahmen um beide Seiten. `<Outlet />` zeigt die aktuelle Kind-Route, `useNavigation()` verrät, ob gerade ein Loader läuft:

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

## Die Seiten

`NotesPage` ist fast die alte `App`. Nur kommen die Notizen jetzt aus dem Loader:

```tsx
import type { notesLoader } from './routes';

export default function NotesPage() {
  const notes = useLoaderData<typeof notesLoader>();
  const [query, setQuery] = useState('');

  const visible = notes
    .filter((n) => matchesQuery(n, query))
    .toSorted((a, b) => Number(b.pinned) - Number(a.pinned));
  // … Suchfeld, Anzahl, <NoteList notes={visible} />
}
```

`import type` holt nur den Typ des Loaders und verschwindet beim Übersetzen. So entsteht zur Laufzeit kein Import-Kreis, obwohl `routes.tsx` die Seiten importiert. Der Suchtext bleibt lokaler State: Er gehört zu dieser Seite, nicht zu den Daten.

In `NoteList` wird jeder Titel ein `<Link>`. Pin- und Delete-Buttons sind vorerst weg – eine statische Datei kann man nicht beschreiben. Sie kommen in der nächsten Lektion zurück, dann über die API.

```tsx
<li key={note.id}>
  {note.pinned && <span aria-hidden="true">📌 </span>}
  <Link to={`/notes/${note.id}`}>{note.title}</Link>
</li>
```

`NotePage` liest die Notiz aus ihrem Loader. Einen `null`-Fall gibt es nicht – den hat der Loader schon mit einem 404 abgefangen:

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

`ErrorPage` zeigt mit `useRouteError()` und `isRouteErrorResponse()` die Fehlerantwort, z. B. „404 – Note not found“. Weil die Detail-Route ein eigenes `errorElement` hat, erscheint der Fehler im Layout, die Navigation bleibt stehen.

::tryit{project-step-2}

> [!NOTE]
> Im Kapitel „Daten laden“ stand `appType: 'mpa'` in der `vite.config.ts`, damit eine fehlende JSON-Datei einen echten 404 liefert. Hier fehlt das absichtlich: Ohne den Fallback auf `index.html` würde ein Neuladen auf `/notes/2` scheitern. Fehlende Notizen erkennt der Loader selbst. Auch beim Hosting braucht eine App mit Browser-Routing so eine Weiterleitung aller Pfade auf `index.html`.

Im nächsten Schritt kommt das Schreiben dazu: ein Formular für neue Notizen, und Pinnen und Löschen auf der Detailseite.
