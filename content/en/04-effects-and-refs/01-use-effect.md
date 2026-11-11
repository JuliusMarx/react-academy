---
title: useEffect
minutes: 8
summary: |-
  - Effects synchronize a component with something outside React: the page title, timers, browser APIs, connections.
  - React runs the Effect **after rendering**, once the DOM has been updated.
  - Without an array it runs after every render, with `[]` only after the first, with `[a, b]` also whenever `a` or `b` changes (compared with `Object.is`).
  - The array must contain every value from the component that the Effect reads – otherwise it works with stale values. The ESLint rule `react-hooks/exhaustive-deps` helps.
  - To make an Effect run less often, change its code rather than the array, e.g. with `setCount((c) => c + 1)`.
  - Responses to actions like clicks belong in event handlers, not in Effects.

  ```tsx
  useEffect(() => {
    document.title = `${count} clicks`;
  }, [count]); // typing in another field doesn't trigger the Effect
  ```

  > [!TIP] Don't turn off `exhaustive-deps` – follow its hints instead.
quiz:
  - question: "When does an Effect with the dependency array `[count]` run?"
    options: ["On every render","Only on the first render","Before the component renders","After the first render and whenever `count` has changed"]
    answer: 3
  - question: "What does an empty dependency array `[]` mean?"
    options: ["The Effect runs only after the first render (mount)","The Effect never runs","The Effect runs on every render","It is an error"]
    answer: 0
  - question: "What is `useEffect` for?"
    options: ["Calculating values from props and state", "Synchronizing a component with something outside of React", "Responding to clicks", "Initializing state"]
    answer: 1
    explanation: "Calculations belong in rendering, and responses to clicks belong in event handlers. Effects are for things like timers, browser APIs, network connections, or external libraries."
exercise:
  example: ex-document-title
  title: The Page Title
  task: |-
    Keep the browser tab title in sync with the counter: **Clicked 0 times**, **Clicked 1 times** …

    Use `useEffect` with the right dependency array – typing in the name field should not trigger the Effect.
  checks:
    initial-title: The title is initially **Clicked 0 times**
    updates-title: After two clicks it reads **Clicked 2 times**
    uses-effect: "The title is set in `useEffect` with `[count]`"
---

# useEffect

Components should be **pure**: they compute their JSX from props and state – nothing more. Sometimes, though, a component needs to trigger something *outside* of React: set the page title, start a timer, listen for window size changes, open a connection. That is what **Effects** are for.

## Creating an Effect

```tsx
import { useEffect, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `${count} clicks`;
  });

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

React runs the function **after rendering** – once the DOM has been updated. That way the Effect doesn't slow down what the user sees.

## The Dependency Array

Without a second argument, the Effect runs after *every* render. Usually you want to restrict that:

| Call | Runs … |
|---|---|
| `useEffect(fn)` | after every render |
| `useEffect(fn, [])` | only after the first render (mount) |
| `useEffect(fn, [a, b])` | after the first render and whenever `a` or `b` has changed |

```tsx
useEffect(() => {
  document.title = `${count} clicks`;
}, [count]); // typing in another field doesn't trigger the Effect
```

React compares each value with the one from the last render (`Object.is`). Only if one has changed does the Effect run again.

## Don't Omit Dependencies

The array must contain **every value from the component** that the Effect reads – props, state, and variables computed from them. If one is missing, the Effect works with stale values.

> [!TIP]
> The ESLint rule `react-hooks/exhaustive-deps` finds missing dependencies automatically. The current Vite template uses the Oxlint linter instead of ESLint; Oxlint already includes the same check as `react/exhaustive-deps`. Follow its hints instead of turning it off.

If you want an Effect to run *less often*, change the Effect's code – not the array. An updater function such as `setCount((c) => c + 1)` often helps, since then `count` doesn't need to be in the list.

## Effects Are Not Event Handlers

An Effect describes what a component should **stay in sync** with – for as long as it is displayed. What happens in response to a specific action (submitting a form, adding a product to the cart) belongs in the event handler.

::tryit{use-effect}
