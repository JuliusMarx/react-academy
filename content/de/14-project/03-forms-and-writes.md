---
title: Formulare und Speichern
minutes: 11
summary: |-
  - `api.ts` wird ein kleiner Fake-Server: Gelesen wird einmal aus `notes.json`, Schreiben (`createNote`, `setPinned`, `deleteNote`) ändert eine Kopie im Speicher – mit künstlicher Verzögerung, wie übers Netz.
  - Neue Route `notes/new` mit `NewNotePage`: Sie speichert über die API und navigiert dann mit `await navigate(…)` zur neuen Notiz – der Loader der Detailseite findet die neue Notiz.
  - `NoteForm` nutzt `useActionState`: Eingaben trimmen, validieren, Fehler als State zurückgeben und in `<p role="alert">` zeigen. `isPending` sperrt den Button.
  - React setzt das Formular nach **jeder** Action zurück – auch nach einem Fehler. Den Entwurf deshalb im State mitgeben und als `defaultValue` setzen.
  - `NoteForm` bekommt `onSave` als Prop, statt die API selbst aufzurufen. So weiß das Formular nichts von Speicherort und Navigation – und lässt sich mit einer Fake-Funktion testen.
  - Nach einer Änderung auf derselben Seite sind die Loader-Daten veraltet: `useRevalidator().revalidate()` lässt die Loader neu laufen. `useTransition` liefert den Ladezustand für die Buttons.

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
  - question: "Warum gibt die Action von `NoteForm` bei einem Fehler auch den `draft` zurück?"
    options: ["Damit React den Fehler anzeigen kann","React setzt die Felder nach jeder Action zurück – mit `defaultValue={state.draft.title}` stehen die Eingaben danach wieder da","Weil `useActionState` sonst einen Fehler wirft","Für die Browser-Validierung"]
    answer: 1
  - question: "`NotePage` ruft `await setPinned(note.id, true)` auf. Warum zeigt die Seite danach ohne `revalidator.revalidate()` noch den alten Stand?"
    options: ["Weil `setPinned` zu langsam ist","Weil der Browser die JSON-Datei cacht","`useLoaderData()` liefert die Daten des letzten Loader-Laufs – erst ein neuer Lauf holt den geänderten Stand","Weil die Komponente keinen State hat"]
    answer: 2
    explanation: "Nach einer Navigation laufen Loader von selbst. Bleibt man auf derselben Seite, stößt `useRevalidator().revalidate()` sie an."
  - question: "Warum bekommt `NoteForm` eine `onSave`-Prop, statt `createNote` selbst aufzurufen?"
    options: ["Sonst funktioniert `isPending` nicht","Props sind schneller als Imports","`useActionState` kann keine Imports aufrufen","Das Formular bleibt unabhängig von Speicherort und Navigation – wiederverwendbar (z. B. zum Bearbeiten) und mit einer Fake-Funktion testbar"]
    answer: 3
exercise:
  example: ex-project-form
  title: Das Notiz-Formular
  task: |-
    Das Formular speichert bisher alles – auch leere Titel – und gibt keine Rückmeldung. Vervollständige `NoteForm.tsx`:

    1. Trimme Titel und Text, bevor du sie prüfst und speicherst.
    2. Schreib `validate(draft)`: Ein Titel unter 3 Zeichen ergibt **The title needs at least 3 characters.**, einer über 60 Zeichen **The title can have at most 60 characters.**
    3. Gibt es einen Fehler, gib ihn mit dem Entwurf zurück und ruf `onSave` nicht auf.
    4. Zeig den Fehler in `<p role="alert">` und setz die Eingaben als `defaultValue`, damit sie nach dem Fehler stehen bleiben.
    5. Solange gespeichert wird, ist der Button gesperrt und zeigt **Saving …**.

    Die Prüfungen rendern `NoteForm` einzeln mit einer Fake-`onSave`. Zum Ausprobieren in der App: **New note**.
  checks:
    validates-title: Zu kurze und zu lange Titel zeigen den passenden Fehler und werden nicht gespeichert
    keeps-input: Nach einem Fehler stehen Titel und Text noch im Formular
    saves-trimmed: Eine gültige Notiz geht getrimmt an `onSave`, ohne Fehlermeldung
    pending: Während des Speicherns ist der Button gesperrt und zeigt **Saving …**
---

# Formulare und Speichern

Die App kann lesen – jetzt soll sie schreiben: neue Notizen anlegen, anpinnen, löschen. Dafür braucht es einen Server, der Änderungen annimmt, ein Formular mit Validierung und einen Weg, die angezeigten Daten danach aufzufrischen.

## Ein Fake-Server

In eine statische Datei kann man nicht schreiben. `api.ts` wird deshalb ein kleiner Fake-Server, wie in den Beispielen der vorigen Kapitel: Gelesen wird einmal aus `notes.json`, danach arbeiten alle Funktionen mit einer Kopie im Speicher. Eine künstliche Verzögerung macht Ladezustände sichtbar.

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

// getNotes, getNote, setPinned und deleteNote nach demselben Muster
```

Für die Komponenten ändert sich nichts: Sie rufen weiter `getNotes()` und Co. auf. Kommt später ein echter Server, tauschst du nur die Funktionen in `api.ts` gegen `fetch` mit `POST`, `PATCH` und `DELETE`. Nach einem Neuladen sind die Änderungen weg – sie lagen ja nur im Speicher.

## Eine Route für neue Notizen

Das Formular bekommt eine eigene Adresse. In `routes.tsx` kommt eine Kind-Route dazu, im Layout ein Link **New note**:

```tsx
children: [
  { index: true, loader: notesLoader, element: <NotesPage /> },
  { path: 'notes/new', element: <NewNotePage /> },
  { path: 'notes/:id', loader: noteLoader, element: <NotePage />, errorElement: <ErrorPage /> },
],
```

Keine Sorge wegen der Reihenfolge: React Router bevorzugt feste Segmente wie `new` vor Parametern wie `:id`.

`NewNotePage` verbindet Formular, API und Navigation:

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

Nach der Navigation läuft der `noteLoader` und findet die neue Notiz. Gehst du zurück zur Liste, holt der `notesLoader` sie ebenfalls – Daten nach einer Navigation frisch zu laden, ist Aufgabe des Routers.

## Das Formular

> [!TIP]
> Du willst das Formular selbst bauen? Dann mach erst die Übung am Ende der Lektion – dieser Abschnitt und das Live-Beispiel zeigen die Lösung.

`NoteForm` nutzt `useActionState` aus dem Kapitel über Formulare. Die Action bekommt die `FormData`, prüft sie und gibt den nächsten State zurück:

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

Die wichtigsten Entscheidungen:

- **Trimmen vor dem Prüfen** – sonst wäre `"   "` ein gültiger Titel.
- **Erwartbare Fehler als State.** Ein zu kurzer Titel ist kein Absturz, sondern eine Meldung. Auch ein Fehler beim Speichern wird abgefangen und angezeigt.
- **`draft` im State.** React setzt das Formular nach jeder Action zurück, auch nach einem Fehler. Mit `defaultValue` aus dem State stehen die Eingaben wieder da.
- **`role="alert"`** sorgt dafür, dass Screenreader die Meldung sofort ansagen.
- **`onSave` als Prop.** Das Formular weiß nicht, wo gespeichert wird und was danach passiert. Dieselbe Komponente könnte eine Notiz bearbeiten – und in Lektion 4 testest du sie mit einer Fake-Funktion.

> [!TIP]
> `required` und `maxLength={60}` an den Feldern geben zusätzlich schnelle Rückmeldung im Browser. Die Prüfung in der Action ersetzen sie nicht – die greift auch, wenn die Daten anders ankommen.

## Pinnen und Löschen

Auf der Detailseite kommen die Buttons zurück, diesmal über die API. Das Problem: Nach `setPinned` bleibt man auf derselben Seite, und `useLoaderData()` liefert weiter die Daten des letzten Loader-Laufs. `useRevalidator()` lässt die Loader der aktuellen Seite neu laufen:

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

Beim Löschen braucht es kein `revalidate` – die Navigation zur Liste lässt den `notesLoader` sowieso laufen. `useTransition` liefert mit `isPending` einen Ladezustand, solange die asynchrone Funktion läuft, und sperrt die Buttons gegen Doppelklicks.

::tryit{project-step-3}

> [!NOTE]
> Der Pin-Button reagiert erst nach der Verzögerung des Fake-Servers. Mit `useOptimistic` aus dem Kapitel über Formulare könnte er sofort umschalten und bei einem Fehler zurückspringen – eine gute Erweiterung zum Selbermachen.
