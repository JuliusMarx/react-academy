---
title: Zustand
minutes: 8
summary: |-
  - `create` aus `zustand` liefert einen Hook – kein Provider, keine Action-Typen. State und Actions stehen zusammen in einem Objekt.
  - `set` ändert den State: Du gibst nur die geänderten Felder an, Zustand fügt sie mit dem Rest zusammen. Wie bei `useState` gilt: neue Objekte statt Veränderung.
  - Mit TypeScript schreibst du `create<BearState>()(…)` – die doppelten Klammern braucht die Typableitung.
  - Komponenten wählen mit einem Selektor aus, was sie brauchen, und rendern nur neu, wenn sich genau dieser Wert ändert.
  - Außerhalb von React liest und ändert `useBearStore.getState()` den Store, `subscribe()` meldet Änderungen.
  - Middleware wie `persist` (speichert in `localStorage`) oder `devtools` erweitert den Store.

  ```ts
  export const useBearStore = create<BearState>()((set) => ({
    bears: 0,
    addBear: () => set((state) => ({ bears: state.bears + 1 })),
    reset: () => set({ bears: 0 }),
  }));

  // in einer Komponente
  const bears = useBearStore((state) => state.bears);
  ```

  > [!WARNING] Ein Selektor, der jedes Mal ein neues Objekt erzeugt (`(s) => ({ a: s.a, b: s.b })`), löst eine Endlosschleife aus – wähle Werte einzeln oder nimm `useShallow`.
quiz:
  - question: "Was gibt `create` in Zustand zurück?"
    options: ["Einen Hook, mit dem Komponenten den Store lesen","Einen Provider","Eine Klasse","Einen Reducer"]
    answer: 0
  - question: "Warum übergibst du `useBearStore` einen Selektor wie `(state) => state.bears`?"
    options: ["Das ist nur Stil", "Die Komponente rendert dann nur neu, wenn sich genau dieser Wert ändert", "Sonst gibt es einen Fehler", "Damit der Store schneller lädt"]
    answer: 1
  - question: "Wie liest du den Store außerhalb einer Komponente, z. B. in einem Event-Listener?"
    options: ["Gar nicht","Mit `useContext`","Mit `useBearStore.getState()`","Mit `window.store`"]
    answer: 2
exercise:
  example: ex-zustand
  title: Ein Todo-Store
  task: |-
    Implementiere die drei Actions in `src/store.ts` mit `set()`. Verändere die bestehenden Todos nie – erzeuge neue.

    - `add(title)` hängt `{ id: nextId++, title, done: false }` an.
    - `toggle(id)` dreht `done` dieses Todos um.
    - `clearDone()` entfernt alle erledigten Todos.
  checks:
    adds: Ein neues Todo erscheint und der Zähler steigt
    toggles: Abhaken aktualisiert Liste, Zähler und Store
    immutable: "`toggle()` erzeugt neue Objekte statt die alten zu ändern"
    clears-done: "**Clear done** entfernt nur erledigte Todos"
---

# Zustand

**Zustand** ist eine kleine State-Management-Bibliothek mit sehr wenig Zeremonie: kein Provider, keine Actions-Typen, kein Boilerplate. Ein Store ist einfach ein Hook.

## Einen Store anlegen

```bash
npm install zustand
```

```ts
import { create } from 'zustand';

type BearState = {
  bears: number;
  addBear: () => void;
  reset: () => void;
};

export const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  reset: () => set({ bears: 0 }),
}));
```

- State und Actions stehen zusammen in einem Objekt.
- **`set`** ändert den State. Du gibst nur die geänderten Felder an – Zustand fügt sie mit dem Rest zusammen. Wie bei `useState` gilt: neue Objekte statt Veränderung.
- Die doppelten Klammern `create<BearState>()(…)` braucht TypeScript, damit es die Typen richtig ableitet.

## Den Store verwenden

```tsx
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  return <p>{bears} Bären</p>;
}

function Controls() {
  const addBear = useBearStore((state) => state.addBear);
  return <button onClick={addBear}>Bär hinzufügen</button>;
}
```

Jede Komponente wählt mit einem **Selektor** aus, was sie braucht – und rendert nur neu, wenn sich genau dieser Wert ändert. Ein Provider ist nicht nötig.

> [!WARNING]
> Ein Selektor, der bei jedem Aufruf ein **neues** Objekt oder Array erzeugt (`(s) => ({ a: s.a, b: s.b })`), löst eine Endlosschleife aus. Wähle Werte einzeln aus oder umhülle den Selektor mit `useShallow` aus `zustand/react/shallow`.

## Außerhalb von React

Der Store funktioniert auch ohne Komponente – praktisch in Tests, Event-Listenern oder Hilfsfunktionen:

```ts
useBearStore.getState().addBear();
const bears = useBearStore.getState().bears;
const unsubscribe = useBearStore.subscribe((state) => console.log(state.bears));
```

## Middleware

Mit Middleware erweiterst du einen Store, z. B. `persist` (speichert in `localStorage`) oder `devtools` (Anbindung an die Redux DevTools):

```ts
import { persist } from 'zustand/middleware';

export const useSettings = create<Settings>()(
  persist((set) => ({ dark: false, toggle: () => set((s) => ({ dark: !s.dark })) }), { name: 'settings' }),
);
```

::tryit{zustand-store}
