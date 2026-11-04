---
title: Zustand
minutes: 8
quiz:
  - question: "What does `create` return in Zustand?"
    options: ["A hook that components use to read the store","A provider","A class","A reducer"]
    answer: 0
  - question: "Why do you pass a selector like `(state) => state.bears` to `useBearStore`?"
    options: ["It's just style", "The component then re-renders only when exactly that value changes", "Otherwise you get an error", "So the store loads faster"]
    answer: 1
  - question: "How do you read the store outside a component, e.g. in an event listener?"
    options: ["You can't","With `useContext`","With `useBearStore.getState()`","With `window.store`"]
    answer: 2
exercise:
  example: ex-zustand
  title: A todo store
  task: |-
    Implement the three actions in `src/store.ts` with `set()`. Never modify the existing todos – create new ones.

    - `add(title)` appends `{ id: nextId++, title, done: false }`.
    - `toggle(id)` flips `done` on that todo.
    - `clearDone()` removes all completed todos.
  checks:
    adds: A new todo appears and the counter goes up
    toggles: Checking one off updates the list, the counter and the store
    immutable: "`toggle()` creates new objects instead of changing the old ones"
    clears-done: "**Clear done** removes only completed todos"
---

# Zustand

**Zustand** is a small state management library with very little ceremony: no provider, no action types, no boilerplate. A store is simply a hook.

## Creating a store

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

- State and actions live together in one object.
- **`set`** changes the state. You pass only the changed fields – Zustand merges them with the rest. As with `useState`: create new objects instead of mutating.
- TypeScript needs the double parentheses `create<BearState>()(…)` to infer the types correctly.

## Using the store

```tsx
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  return <p>{bears} bears</p>;
}

function Controls() {
  const addBear = useBearStore((state) => state.addBear);
  return <button onClick={addBear}>Add bear</button>;
}
```

Each component uses a **selector** to pick what it needs – and re-renders only when exactly that value changes. No provider is needed.

> [!WARNING]
> A selector that creates a **new** object or array on every call (`(s) => ({ a: s.a, b: s.b })`) triggers an infinite loop. Select values individually, or wrap the selector with `useShallow` from `zustand/react/shallow`.

## Outside of React

The store also works without a component – handy in tests, event listeners or helper functions:

```ts
useBearStore.getState().addBear();
const bears = useBearStore.getState().bears;
const unsubscribe = useBearStore.subscribe((state) => console.log(state.bears));
```

## Middleware

With middleware you extend a store, e.g. `persist` (saves to `localStorage`) or `devtools` (connects to the Redux DevTools):

```ts
import { persist } from 'zustand/middleware';

export const useSettings = create<Settings>()(
  persist((set) => ({ dark: false, toggle: () => set((s) => ({ dark: !s.dark })) }), { name: 'settings' }),
);
```

::tryit{zustand-store}
