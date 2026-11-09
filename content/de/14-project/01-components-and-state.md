---
title: Plan, Komponenten und State
minutes: 9
summary: |-
  - Das Projekt: eine Notiz-App in vier Schritten – Komponenten und State, Routen und Laden, Formular und Speichern, Tests. Jede Lektion baut auf dem Stand der vorigen auf.
  - Erst planen: Die Oberfläche in Komponenten zerlegen (`App` → `NoteList` → `NoteItem`), dann den **minimalen State** suchen.
  - State sind nur die Notizen und der Suchtext. Die gefilterte, sortierte Liste und die Anzahl berechnest du beim Rendern.
  - State nie verändern: `map` mit `{ ...n, pinned: !n.pinned }` zum Ändern, `filter` zum Löschen.
  - Daten fließen per Props nach unten, Ereignisse per Callback (`onTogglePinned`, `onDelete`) nach oben – der State bleibt in `App`.
  - Listen bekommen `key={note.id}`, wiederholte Buttons ein `aria-label`, das sagt, zu welcher Notiz sie gehören.

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
  - question: "Was gehört in der Notiz-App in den State?"
    options: ["Die Anzahl der Treffer","Die Notizen, der Suchtext und die gefilterte Liste","Nur die gefilterte Liste","Die Notizen und der Suchtext"]
    answer: 3
    explanation: "Die gefilterte Liste und die Anzahl lassen sich jederzeit aus Notizen und Suchtext berechnen. Als eigener State müsstest du sie bei jeder Änderung mitpflegen."
  - question: "Warum `setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))` statt `note.pinned = !note.pinned`?"
    options: ["React vergleicht Referenzen – nur ein neues Array mit einem neuen Objekt zeigt eine Änderung an. Verändertes Original rendert nicht zuverlässig neu","`map` ist schneller","TypeScript verbietet Zuweisungen an Props","Weil `pinned` schreibgeschützt ist"]
    answer: 0
  - question: "Welchen `key` bekommt `NoteItem` in der Liste?"
    options: ["Den Index aus `map`","`note.id`","`Math.random()`","`note.title`"]
    answer: 1
    explanation: "Die Liste wird sortiert, gefiltert und gelöscht – der Index wandert dabei. Die ID bleibt stabil und ist eindeutig, Titel können doppelt vorkommen."
---

# Plan, Komponenten und State

In diesem Kapitel baust du eine kleine Notiz-App – nicht Beispiel für Beispiel, sondern als **ein** Projekt, das mit jeder Lektion wächst. Dabei kommt fast alles vor, was du bisher gelernt hast:

| Schritt | Was die App danach kann | Aus Kapitel |
|---|---|---|
| 1. Komponenten und State | Notizen anzeigen, durchsuchen, anpinnen, löschen | JSX & Komponenten, State |
| 2. Routen und Daten | Liste und Detailseite, Daten aus einer JSON-Datei | Daten laden, Routing |
| 3. Formulare und Speichern | Neue Notizen mit Validierung, Pinnen und Löschen über die API | Formulare & Actions |
| 4. Testen | Tests für Liste und Formular | Testing |

Jede Lektion endet mit dem kompletten Stand als Live-Beispiel. Du kannst also jederzeit einsteigen – oder deinen eigenen Stand weiterbauen.

## Erst planen

Bevor du Code schreibst, lohnt sich ein Blick auf die fertige Oberfläche. Für den ersten Schritt: eine Überschrift, ein Suchfeld, eine Zeile „2 of 3 notes“ und die Liste. Jede Notiz hat Titel, Text und zwei Buttons.

Daraus ergeben sich die Komponenten:

```text
App               Suchfeld, Anzahl, State
└─ NoteList       die Liste – oder „No notes found.“
   └─ NoteItem    eine Notiz mit Pin- und Delete-Button
```

Die Regel aus dem Kapitel über State: Erst den **minimalen** State finden, alles andere berechnen.

| Daten | State? | Warum |
|---|---|---|
| Die Notizen | Ja | Ändern sich durch Pinnen und Löschen |
| Der Suchtext | Ja | Ändert sich durch Tippen |
| Die gefilterte, sortierte Liste | Nein | Aus Notizen und Suchtext berechenbar |
| „2 of 3 notes“ | Nein | Zwei Längen – berechenbar |

## Die Daten

Der Typ und die Startdaten stehen in einer eigenen Datei. Die Suche ist eine kleine reine Funktion – sie wird in allen Schritten gebraucht:

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

## Der State in App

`App` hält die beiden State-Werte und berechnet beim Rendern, was angezeigt wird:

```tsx
export default function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [query, setQuery] = useState('');

  // Beim Rendern berechnet – angepinnte Notizen zuerst
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

`toSorted` liefert ein neues Array – `sort` würde das Array an Ort und Stelle sortieren, und das wäre hier der State selbst. Ein `useMemo` brauchst du nicht: Drei Notizen zu filtern kostet nichts.

## Ändern, ohne zu verändern

Pinnen und Löschen erzeugen jeweils ein neues Array. Die geänderte Notiz wird ein neues Objekt, alle anderen bleiben, wie sie sind:

```tsx
function togglePinned(id: number) {
  setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
}

function deleteNote(id: number) {
  setNotes(notes.filter((n) => n.id !== id));
}
```

## Props runter, Ereignisse rauf

`NoteList` und `NoteItem` haben keinen eigenen State. Sie bekommen die Daten als Props und melden Klicks über Callbacks nach oben – entscheiden, was passiert, tut `App`:

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

Zwei Details aus dem Kapitel über Barrierefreiheit: Jede Notiz hat einen „Delete“-Button. Für einen Screenreader klingen alle gleich – das `aria-label` sagt, welche Notiz gemeint ist. Und das 📌 ist Dekoration (`aria-hidden`), der Button-Text „Unpin“ sagt dasselbe.

In `NoteList` bekommt jedes `NoteItem` den `key={note.id}`. Der Index wäre falsch: Die Liste wird sortiert, gefiltert und gekürzt.

::tryit{project-step-1}

> [!TIP]
> Probier es aus: Pinne „React ideas“ an – die Notiz rutscht nach oben. Such nach „milk“ und lösch die Notiz – die Anzahl stimmt sofort, weil sie berechnet wird.

In der nächsten Lektion bekommt die App eine Detailseite pro Notiz, und die Daten kommen nicht mehr aus dem Code, sondern vom „Server“.
