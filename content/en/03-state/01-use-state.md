---
title: useState
minutes: 8
quiz:
  - question: "Why doesn't a regular variable `let count = 0` show the new value after `count++`?"
    options: ["Because `let` is forbidden in React","Because numbers aren't displayed","Because changing it doesn't trigger a re-render, and on the next render the value is 0 again","It does show it"]
    answer: 2
  - question: "`count` is 0. What is `count` after a click on a button with `setCount(count + 1); setCount(count + 1);`?"
    options: ["0","An error","2","1"]
    answer: 3
    explanation: "Both calls see `count` from the same render, so it is `0 + 1` twice. With `setCount((c) => c + 1)` it would be 2."
  - question: "Where may you call `useState`?"
    options: ["Only at the top level of a component or a custom Hook","Anywhere, including loops and `if`","Only in event handlers","Only in `main.tsx`"]
    answer: 0
exercise:
  example: ex-counter
  title: A Counter
  task: |-
    The buttons are already there, but their handlers are still empty:

    1. **+** increases by 1.
    2. **−** decreases by 1, but never below 0.
    3. **+3** calls the setter three times and really increases by 3.
    4. **Reset** sets it back to 0.
  checks:
    increments: "**+** increments the counter"
    decrements: "**−** decrements it, but not below 0"
    adds-three: "**+3** increases it by exactly 3"
    resets: "**Reset** sets it to 0"
---

# useState

So far, our components only display fixed data. For something to change – a counter, an open menu, typed text – a component needs a **memory**: **state**.

## Why not a regular variable?

```tsx
function Counter() {
  let count = 0;
  return <button onClick={() => count++}>{count}</button>; // stays at 0
}
```

This doesn't work for two reasons: Changing `count` doesn't tell React to re-render. And even if it did – the next time the function is called, `count` starts at 0 again.

## useState

The **Hook** `useState` solves both:

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count} clicks</button>;
}
```

- `useState(0)` creates state with the initial value `0`.
- It returns a pair: the **current value** and a **setter function**. You can choose the names freely; `[x, setX]` is the convention.
- When you call the setter, React remembers the new value and **re-renders the component**. Then `useState` returns the new value.

Each instance of a component has its own state. Two `<Counter />` components count independently of each other.

## State is a snapshot

Within a single render, `count` doesn't change – not even right after `setCount`:

```tsx
function handleClick() {
  setCount(count + 1);
  console.log(count); // still the old value!
}
```

The setter schedules a new render, while the current one keeps running with the old value. That's why three calls to `setCount(count + 1)` only increase the count by 1.

## Updater functions

If the new value depends on the previous one, pass a **function**. React hands it the latest value each time:

```tsx
setCount((c) => c + 1);
setCount((c) => c + 1);
setCount((c) => c + 1); // now it really is +3
```

## Rules of Hooks

Everything that starts with `use` is a **Hook**. You only call Hooks at the **top level** of a component – not inside conditions, loops, or nested functions. React associates state with each Hook by the order of the calls.

::tryit{use-state}
