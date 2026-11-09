---
title: Testen und Ausblick
minutes: 10
summary: |-
  - Getestet wird Verhalten aus Sicht der Nutzer: Was steht da, was passiert nach Tippen und Klicken – mit `screen.getByRole`, `getByLabelText` und `userEvent`.
  - Seiten mit Loadern testest du in einem `createMemoryRouter` mit `initialEntries` und **Stub-Loadern** wie `loader: () => notes`. Kein `fetch`, kein Fake-Server – der Test bestimmt die Daten.
  - Loader sind asynchron: direkt nach `render` mit `await screen.findBy…` warten, bis die Seite da ist.
  - Das Formular testest du allein, mit `onSave = vi.fn(async () => {})`: `expect(onSave).not.toHaveBeenCalled()` bei einem Fehler, `toHaveBeenCalledWith({ title, body })` bei Erfolg.
  - Die Action läuft asynchron – `await waitFor(() => expect(…))` wiederholt die Prüfung, bis sie passt.
  - Ausbau-Ideen: Suche in der URL (`useSearchParams`), eine Bearbeiten-Route mit demselben `NoteForm`, `useOptimistic` fürs Pinnen, Fokus nach Seitenwechseln, ein echtes Backend, Playwright-Tests.

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
  - question: "Warum nutzen die Tests `createMemoryRouter` statt `createBrowserRouter`?"
    options: ["`createBrowserRouter` funktioniert nicht in TypeScript","Weil Tests keine Links enthalten dürfen","Er ist schneller beim Rendern","Der Memory-Router hält die URL im Speicher: Jeder Test startet mit `initialEntries` auf seinem Pfad und kann eigene Stub-Loader mitbringen"]
    answer: 3
  - question: "Warum steht direkt nach `render` ein `await screen.findAllByRole('link')` statt `getAllByRole`?"
    options: ["Der Loader läuft asynchron – `find…` wartet, bis die Links erscheinen, `get…` würde sofort fehlschlagen","`findAll…` findet mehr Elemente","Weil `render` ein Promise zurückgibt","`getAllByRole` gibt es nicht"]
    answer: 0
  - question: "Wie prüfst du, dass `NoteForm` einen zu kurzen Titel nicht speichert?"
    options: ["Im Test `createNote` aufrufen und die JSON-Datei lesen","Mit `onSave = vi.fn()` rendern, absenden, dann `expect(onSave).not.toHaveBeenCalled()` – und die Meldung mit `findByRole('alert')` prüfen","Gar nicht, das prüft der Browser mit `required`","Mit einem Snapshot des Formulars"]
    answer: 1
exercise:
  example: ex-project-tests
  title: Tests für das Notiz-Formular
  task: |-
    Schreib in `NoteForm.test.tsx` mindestens zwei Tests für das Formular aus der letzten Lektion. `onSave` ist jeweils eine Fake-Funktion: `vi.fn(async (_draft: NoteDraft) => {})`.

    1. Ein zu kurzer Titel (z. B. **Hi**) zeigt eine Fehlermeldung (Rolle `alert`) – und `onSave` wird **nicht** aufgerufen.
    2. Eine gültige Notiz ruft `onSave` mit Titel **und** Text auf, z. B. `{ title: 'Groceries', body: 'Milk, eggs' }`.

    Die Felder findest du mit `screen.getByLabelText('Title')` und `getByLabelText('Text')`, den Button mit `getByRole('button', { name: 'Save note' })`. Die Prüfungen lassen deine Tests auch gegen kaputte Versionen des Formulars laufen – gute Tests schlagen dort fehl.
  checks:
    tests-pass: Mindestens zwei Tests, alle grün
    catches-validation: Die Tests merken, wenn ein zu kurzer Titel trotzdem gespeichert wird
    catches-message: Die Tests merken, wenn die Fehlermeldung fehlt
    catches-body: Die Tests merken, wenn der Text nicht mitgespeichert wird
---

# Testen und Ausblick

Die App läuft. Damit das so bleibt, wenn du sie weiterbaust, bekommt sie Tests. Wie im Testing-Kapitel prüfen sie Verhalten aus Sicht der Nutzer – nicht, welche Hooks oder States eine Komponente intern hat.

## Was testen?

| Teil | Was ist wichtig | Wie |
|---|---|---|
| `NotesPage` | Angepinnte zuerst, Suche filtert, Link führt zur Notiz | Memory-Router mit Stub-Loadern |
| `NoteForm` | Validierung, Meldung, was gespeichert wird | Allein rendern, `onSave` als `vi.fn()` |
| `api.ts` | Fake-Server – in einer echten App der Server selbst | Hier nicht, sonst eigene Tests oder Playwright |

## Seiten mit Loadern testen

`NotesPage` liest ihre Daten mit `useLoaderData()` – ohne Router-Kontext würde sie abstürzen. Ein `createMemoryRouter` hält die URL im Speicher statt in der Adresszeile. Mit `initialEntries` startet jeder Test auf seinem Pfad, und die Loader dürfen Stubs sein, die einfach Testdaten zurückgeben:

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

Warum nicht die echten `routes` mit gemocktem `fetch`? Das ginge – aber der Fake-Server merkt sich die Notizen nach dem ersten Laden, ein Test würde die Daten des vorigen sehen. Stub-Loader machen jeden Test unabhängig, und die Testdaten stehen direkt im Test.

Die Tests selbst:

```tsx
it('lists pinned notes first', async () => {
  renderNotes();

  // findBy… wartet, bis der Loader fertig ist
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

Der dritte Test klickt einen echten `<Link>` – der Memory-Router navigiert, der Stub-Loader der Detailseite läuft, und die echte `NotePage` zeigt die Notiz.

::tryit{project-tests}

## Das Formular testen

`NoteForm` braucht keinen Router: Es bekommt `onSave` als Prop. Im Test ist das ein `vi.fn()`, das jeden Aufruf mitschreibt:

```tsx
const onSave = vi.fn(async (_draft: NoteDraft) => {});
render(<NoteForm onSave={onSave} />);

await user.type(screen.getByLabelText('Title'), 'Groceries');
await user.click(screen.getByRole('button', { name: 'Save note' }));

// Die Action läuft asynchron – waitFor wiederholt, bis die Erwartung stimmt
await waitFor(() => expect(onSave).toHaveBeenCalledWith({ title: 'Groceries', body: '' }));
```

Hier zahlt sich die Entscheidung aus der letzten Lektion aus: Weil das Formular nicht selbst speichert und navigiert, ist es mit drei Zeilen testbar. In der Übung schreibst du die Tests dafür.

## Rückblick

| Baustein | Wo im Projekt | Kapitel |
|---|---|---|
| Komponenten, Props, Callbacks | `NoteList`, `NoteItem` | JSX & Komponenten |
| Minimaler State, abgeleitete Werte | Suche, Sortierung, Anzahl | State |
| Daten laden, `api.ts` | `getNotes`, `getNote` | Daten laden |
| Routen, Parameter, Loader, `errorElement` | `routes.tsx` | Routing |
| `useActionState`, Validierung | `NoteForm` | Formulare & Actions |
| `useTransition` | Pinnen und Löschen | Fortgeschritten |
| `aria-label`, `role="alert"` | Buttons, Fehlermeldung | Barrierefreiheit |
| Testing Library, `vi.fn` | `NotesPage.test.tsx`, `NoteForm.test.tsx` | Testing |

## Wie es weitergehen kann

Die App ist bewusst klein. Ideen, um sie auszubauen – jede übt ein Thema aus dem Kurs:

- **Suche in der URL:** Mit `useSearchParams` steht der Suchtext in `/?q=milk` – teilbar und nach dem Zurück-Button noch da.
- **Notizen bearbeiten:** Eine Route `notes/:id/edit`, die `NoteForm` mit Startwerten wiederverwendet.
- **Sofort pinnen:** `useOptimistic` schaltet den Button um, bevor der Server antwortet.
- **Fokus nach Seitenwechseln:** Die Überschrift der neuen Seite fokussieren, wie im Kapitel über Barrierefreiheit.
- **Ein echtes Backend:** `api.ts` gegen `fetch` mit `POST`/`PATCH`/`DELETE` tauschen – oder TanStack Query für Caching und Neuladen nutzen.
- **Ende-zu-Ende-Tests:** Mit Playwright den ganzen Ablauf „Notiz anlegen, in der Liste finden, löschen“ im echten Browser prüfen.

> [!TIP]
> Fang mit einem neuen Projekt an (`npm create vite@latest`, Vorlage „React + TypeScript“) und bau die App ohne Vorlage nach. Wo du hängen bleibst, weißt du, welche Lektion du dir noch einmal ansehen solltest.
