---
title: useReducer
minutes: 8
quiz:
  - question: "Was gibt `useReducer(reducer, initialState)` zurück?"
    options: ["Nur den State","Den Reducer und den State","Den aktuellen State und eine `dispatch`-Funktion","Ein Promise"]
    answer: 2
  - question: "Was darf ein Reducer nicht?"
    options: ["Einen neuen State zurückgeben","Mehrere Action-Typen behandeln","Ein `switch` verwenden","Den bisherigen State verändern oder Nebenwirkungen auslösen"]
    answer: 3
    explanation: "Ein Reducer ist eine reine Funktion: Er berechnet aus altem State und Action den neuen State – ohne etwas zu verändern, ohne Netzwerk, ohne Zufall."
  - question: "Wann lohnt sich `useReducer` statt `useState`?"
    options: ["Wenn viele Event-Handler denselben State auf unterschiedliche Weise ändern","Immer","Nur für Zahlen","Nur mit Context"]
    answer: 0
exercise:
  example: ex-reducer
  title: Ein Warenkorb
  task: |-
    Implementiere `cartReducer` in `src/cartReducer.ts`. Verändere den bestehenden State nie – gib immer ein neues Array zurück.

    - `added`: Ein neues Produkt bekommt `quantity: 1`, ein vorhandenes `quantity + 1`.
    - `removed`: entfernt den Eintrag mit dieser ID.
    - `cleared`: leert den Warenkorb.
  checks:
    adds-new: Ein neues Produkt landet mit Menge 1 im Warenkorb
    increments: Ein vorhandenes Produkt bekommt Menge + 1, ohne den alten State zu verändern
    removes-and-clears: "`removed` und `cleared` funktionieren"
    app-total: In der App stimmt die Summe (9.90 €)
---

# useReducer

Je mehr Event-Handler denselben State ändern, desto unübersichtlicher wird eine Komponente. Mit **`useReducer`** sammelst du alle Änderungen an einer Stelle: in einer **Reducer-Funktion**.

## Von setState zu dispatch

Statt in jedem Handler zu beschreiben, *wie* sich der State ändert, meldest du nur, *was passiert ist* – mit einer **Action**:

```tsx
// mit useState
setTodos([...todos, { id: nextId++, title, done: false }]);

// mit useReducer
dispatch({ type: 'added', title });
```

## Der Reducer

Ein Reducer bekommt den aktuellen State und eine Action und gibt den **nächsten State** zurück:

```ts
type Action =
  | { type: 'added'; title: string }
  | { type: 'toggled'; id: number }
  | { type: 'deleted'; id: number };

function todosReducer(todos: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'added':
      return [...todos, { id: nextId++, title: action.title, done: false }];
    case 'toggled':
      return todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'deleted':
      return todos.filter((t) => t.id !== action.id);
  }
}
```

Mit einem TypeScript-Union-Typ für die Actions prüft der Compiler, dass jede Action die richtigen Felder hat und jeder Fall behandelt wird.

## In der Komponente

```tsx
import { useReducer } from 'react';

function TodoApp() {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.done} onChange={() => dispatch({ type: 'toggled', id: todo.id })} />
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
```

`dispatch` bleibt über alle Renderings dieselbe Funktion – du kannst sie bedenkenlos an Kinder weitergeben.

## Reducer sind rein

Ein Reducer läuft während des Renderns (in StrictMode sogar doppelt). Deshalb gilt:

- **Nichts verändern** – immer neue Objekte und Arrays zurückgeben.
- **Keine Nebenwirkungen** – kein `fetch`, kein `localStorage`, keine Timer.

Dafür lässt er sich wunderbar testen: Er ist eine ganz normale Funktion ohne React.

> [!TIP]
> `useState` und `useReducer` können dasselbe. Nimm `useReducer`, wenn die Update-Logik wächst oder du sie getrennt von der Komponente testen willst.

::tryit{use-reducer}
