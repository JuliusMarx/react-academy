---
title: useReducer
minutes: 8
quiz:
  - question: "What does `useReducer(reducer, initialState)` return?"
    options: ["Only the state", "The current state and a `dispatch` function", "The reducer and the state", "A promise"]
    answer: 1
  - question: "What must a reducer not do?"
    options: ["Return a new state", "Mutate the previous state or trigger side effects", "Use a `switch`", "Handle multiple action types"]
    answer: 1
    explanation: "A reducer is a pure function: it calculates the new state from the old state and an action – without mutating anything, without network requests, without randomness."
  - question: "When is `useReducer` worth using instead of `useState`?"
    options: ["Always", "When many event handlers change the same state in different ways", "Only for numbers", "Only with Context"]
    answer: 1
exercise:
  example: ex-reducer
  title: A Shopping Cart
  task: |-
    Implement `cartReducer` in `src/cartReducer.ts`. Never mutate the existing state – always return a new array.

    - `added`: A new product gets `quantity: 1`, an existing one gets `quantity + 1`.
    - `removed`: removes the entry with that ID.
    - `cleared`: empties the cart.
  checks:
    adds-new: A new product ends up in the cart with quantity 1
    increments: An existing product gets quantity + 1 without mutating the old state
    removes-and-clears: "`removed` and `cleared` work"
    app-total: The total in the app is correct (9.90 €)
---

# useReducer

The more event handlers change the same state, the harder a component is to follow. With **`useReducer`** you gather all state changes in one place: a **reducer function**.

## From setState to dispatch

Instead of describing *how* the state changes in every handler, you only report *what happened* – with an **action**:

```tsx
// with useState
setTodos([...todos, { id: nextId++, title, done: false }]);

// with useReducer
dispatch({ type: 'added', title });
```

## The reducer

A reducer takes the current state and an action and returns the **next state**:

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

With a TypeScript union type for the actions, the compiler checks that every action has the right fields and that every case is handled.

## In the component

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

`dispatch` stays the same function across all renders – you can safely pass it down to children.

## Reducers are pure

A reducer runs during rendering (twice in StrictMode). That's why:

- **Don't mutate anything** – always return new objects and arrays.
- **No side effects** – no `fetch`, no `localStorage`, no timers.

In return, it's easy to test: it's a perfectly ordinary function that needs no React.

> [!TIP]
> `useState` and `useReducer` can do the same things. Use `useReducer` when the update logic grows or when you want to test it separately from the component.

::tryit{use-reducer}
