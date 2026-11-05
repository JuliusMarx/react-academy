---
title: useState
minutes: 8
summary: |-
  - Eine normale Variable reicht nicht: Ihre Änderung löst kein neues Rendern aus, und beim nächsten Aufruf beginnt sie wieder beim Startwert.
  - `useState(0)` legt State mit Startwert an und liefert ein Paar: aktueller Wert und Setter, üblich als `[x, setX]`.
  - Der Setter merkt sich den neuen Wert und rendert die Komponente neu. Jede Instanz einer Komponente hat ihren eigenen State.
  - State ist ein Schnappschuss: Innerhalb eines Renderns bleibt `count` gleich, auch direkt nach `setCount`.
  - Hängt der neue Wert vom alten ab, übergib eine Updater-Funktion: `setCount((c) => c + 1)`.
  - Hooks (alles mit `use…`) rufst du nur auf oberster Ebene einer Komponente auf – nicht in Bedingungen, Schleifen oder verschachtelten Funktionen.

  ```tsx
  import { useState } from 'react';

  function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count} Klicks</button>;
  }
  ```

  > [!WARNING] Dreimal `setCount(count + 1)` erhöht nur um 1 – mit `setCount((c) => c + 1)` wirklich um 3.
quiz:
  - question: "Warum zeigt eine normale Variable `let count = 0` nach `count++` nicht den neuen Wert an?"
    options: ["Weil `let` in React verboten ist","Weil Zahlen nicht angezeigt werden","Weil eine Änderung kein neues Rendern auslöst und der Wert beim nächsten Rendern wieder 0 ist","Sie zeigt ihn an"]
    answer: 2
  - question: "`count` ist 0. Was ist `count` nach einem Klick auf einen Button mit `setCount(count + 1); setCount(count + 1);`?"
    options: ["0","Ein Fehler","2","1"]
    answer: 3
    explanation: "Beide Aufrufe sehen `count` aus demselben Rendern, also zweimal `0 + 1`. Mit `setCount((c) => c + 1)` wären es 2."
  - question: "Wo darfst du `useState` aufrufen?"
    options: ["Nur auf oberster Ebene einer Komponente oder eines eigenen Hooks","Überall, auch in Schleifen und `if`","Nur in Event-Handlern","Nur in `main.tsx`"]
    answer: 0
exercise:
  example: ex-counter
  title: Ein Zähler
  task: |-
    Die Buttons sind schon da, ihre Handler aber noch leer:

    1. **+** erhöht um 1.
    2. **−** verringert um 1, aber nie unter 0.
    3. **+3** ruft den Setter dreimal auf und erhöht wirklich um 3.
    4. **Reset** setzt auf 0 zurück.
  checks:
    increments: "**+** erhöht den Zähler"
    decrements: "**−** verringert ihn, aber nicht unter 0"
    adds-three: "**+3** erhöht um genau 3"
    resets: "**Reset** setzt auf 0"
---

# useState

Bisher zeigen unsere Komponenten nur feste Daten an. Damit sich etwas ändert – ein Zähler, ein geöffnetes Menü, eingegebener Text –, braucht eine Komponente ein **Gedächtnis**: **State**.

## Warum keine normale Variable?

```tsx
function Counter() {
  let count = 0;
  return <button onClick={() => count++}>{count}</button>; // bleibt bei 0
}
```

Das funktioniert nicht aus zwei Gründen: Eine Änderung an `count` sagt React nicht, dass neu gerendert werden soll. Und selbst wenn – beim nächsten Aufruf der Funktion beginnt `count` wieder bei 0.

## useState

Der **Hook** `useState` löst beides:

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count} Klicks</button>;
}
```

- `useState(0)` legt State mit dem Startwert `0` an.
- Zurück kommt ein Paar: der **aktuelle Wert** und eine **Setter-Funktion**. Die Namen wählst du frei, üblich ist `[x, setX]`.
- Ruft man den Setter auf, merkt React sich den neuen Wert und **rendert die Komponente neu**. Dann liefert `useState` den neuen Wert.

Jede Instanz einer Komponente hat ihren eigenen State. Zwei `<Counter />` zählen unabhängig voneinander.

## State ist ein Schnappschuss

Innerhalb eines Renderns ändert sich `count` nicht – auch nicht direkt nach `setCount`:

```tsx
function handleClick() {
  setCount(count + 1);
  console.log(count); // noch der alte Wert!
}
```

Der Setter plant ein neues Rendern ein, das aktuelle läuft mit dem alten Wert weiter. Deshalb erhöhen drei Aufrufe von `setCount(count + 1)` nur um 1.

## Updater-Funktionen

Hängt der neue Wert vom vorherigen ab, übergib eine **Funktion**. React reicht ihr den jeweils neuesten Wert durch:

```tsx
setCount((c) => c + 1);
setCount((c) => c + 1);
setCount((c) => c + 1); // jetzt wirklich +3
```

## Regeln für Hooks

Alles, was mit `use` beginnt, ist ein **Hook**. Hooks rufst du nur auf **oberster Ebene** einer Komponente auf – nicht in Bedingungen, Schleifen oder verschachtelten Funktionen. React ordnet den State über die Reihenfolge der Aufrufe zu.

::tryit{use-state}
