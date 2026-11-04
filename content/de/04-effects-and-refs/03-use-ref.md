---
title: useRef
minutes: 8
quiz:
  - question: "Was passiert, wenn du `ref.current` änderst?"
    options: ["Die Komponente rendert neu", "Nichts – der Wert wird gespeichert, ohne neu zu rendern", "React wirft einen Fehler", "Der State wird zurückgesetzt"]
    answer: 1
  - question: "Wann ist `inputRef.current` mit dem DOM-Element befüllt?"
    options: ["Schon während des ersten Renderns", "Nachdem React das Element ins DOM eingefügt hat – z. B. in Event-Handlern und Effekten", "Nie, man braucht `document.querySelector`", "Nur bei Klassenkomponenten"]
    answer: 1
  - question: "Wie gibst du in React 19 einen Ref an eine eigene Komponente weiter?"
    options: ["Nur mit `forwardRef`", "Als ganz normale Prop `ref`", "Gar nicht", "Über Context"]
    answer: 1
exercise:
  example: ex-focus
  title: Fokus und Eingabe
  task: |-
    Das Eingabefeld ist **unkontrolliert** (`defaultValue`). Greife über einen Ref darauf zu:

    1. Lege mit `useRef` einen Ref an und hänge ihn mit `ref={…}` an das Feld.
    2. **Focus** setzt den Cursor ins Feld.
    3. **Clear** leert das Feld und fokussiert es.
    4. **Send** zeigt den aktuellen Inhalt des Felds in `#message`.
  checks:
    focus-button: "**Focus** fokussiert das Feld"
    send: "**Send** zeigt den Inhalt an"
    clear: "**Clear** leert das Feld und fokussiert es"
---

# useRef

Manchmal braucht eine Komponente einen Wert, der Renderings überdauert, aber **kein neues Rendern auslösen** soll – oder direkten Zugriff auf ein DOM-Element. Dafür gibt es **Refs**.

## Ein Ref ist eine Box

```tsx
import { useRef } from 'react';

const intervalRef = useRef<number | null>(null);
```

`useRef` gibt ein Objekt `{ current: … }` zurück. Es ist bei jedem Rendern **dasselbe Objekt**. Du kannst `current` lesen und überschreiben – React bekommt davon nichts mit.

| Merkmal | State | Ref |
|---|---|---|
| Änderung löst Rendern aus | ja | nein |
| Wert ändern | über den Setter | `ref.current = …` |
| Im JSX anzeigen | ja | nicht geeignet |

Typische Inhalte: Timer-IDs, das vorherige Ergebnis einer Berechnung, Instanzen externer Bibliotheken.

```tsx
function start() {
  intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
}

function stop() {
  if (intervalRef.current !== null) clearInterval(intervalRef.current);
}
```

> [!WARNING]
> Lies und schreibe `ref.current` nicht während des Renderns (außer zum einmaligen Initialisieren). Das Ergebnis wäre unvorhersehbar. Refs gehören in Event-Handler und Effekte.

## DOM-Elemente

Übergibst du einen Ref an das Attribut `ref` eines Elements, setzt React `current` auf das DOM-Element:

```tsx
function Search() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Suchen</button>
    </>
  );
}
```

Während des ersten Renderns ist `current` noch `null` – das Element existiert erst danach. In Event-Handlern und Effekten ist es gesetzt.

Typische Anwendungen: fokussieren, scrollen (`scrollIntoView`), Größe messen, Medien abspielen, Bibliotheken wie Karten oder Charts einbinden.

## Refs an eigene Komponenten

Seit React 19 ist `ref` bei Funktionskomponenten eine **normale Prop**. `forwardRef` brauchst du nicht mehr:

```tsx
import type { ComponentProps } from 'react';

function TextInput({ ref, ...props }: ComponentProps<'input'>) {
  return <input ref={ref} {...props} />;
}

<TextInput ref={inputRef} placeholder="Name" />
```

::tryit{use-ref}
