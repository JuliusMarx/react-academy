---
title: Custom Hooks
minutes: 8
quiz:
  - question: "What makes a function a custom hook?"
    options: ["It is marked with `@hook`", "Its name starts with `use` and it calls other hooks", "It lives in the `hooks/` folder", "It returns JSX"]
    answer: 1
  - question: "Two components call `useWindowWidth()`. Do they share the same state?"
    options: ["Yes, custom hooks are global", "No, each call has its own state – only the logic is shared", "Only if they are siblings", "Only in StrictMode"]
    answer: 1
exercise:
  example: ex-custom-hook
  title: useLocalStorage
  task: |-
    In `src/useLocalStorage.ts`, write a hook that works like `useState` but remembers the value in `localStorage`:

    1. Start with the stored value (`JSON.parse`) if there is one, otherwise with `initialValue`. Pass `useState` a function for this, so `localStorage` is only read on the first render.
    2. Save the value with `JSON.stringify` whenever it changes – in an effect.
  checks:
    initial-value: Without a stored value, `initialValue` is used
    stores: New values are saved as JSON in `localStorage`
    reads-stored: A stored value is read on startup
---

# Custom Hooks

When several components need the same logic – "am I online?", "how wide is the window?" – you extract it into a **custom hook**.

## Writing a hook

A custom hook is a function whose name starts with **`use`** and which uses other hooks:

```ts
import { useEffect, useState } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}
```

You use it like any built-in hook:

```tsx
function SizeInfo() {
  const width = useWindowWidth();
  return <p>{width < 600 ? 'Small' : 'Large'}</p>;
}
```

The component no longer needs to know anything about event listeners and cleanup – it only says *what* it needs.

## Share logic, not state

Every call to a hook has **its own state**. If two components call `useWindowWidth()`, each has its own `width` variable and its own listener. Only the code is shared.

If components really should use the *same* state, lift it up or use Context.

## Rules

- The name starts with `use` followed by an uppercase letter: `useOnlineStatus`, `useLocalStorage`. This is how React and the linter know the rules of hooks apply.
- The same rules apply as for built-in hooks: call them only at the top level, not inside conditions or loops.
- A function that doesn't call any hooks doesn't need `use` – then it's just an ordinary helper function.

## Good candidates

- Subscriptions to browser events: `useOnlineStatus`, `useMediaQuery`
- Recurring state patterns: `useToggle`, `useLocalStorage`
- Fetching data: `useFetch` – in practice usually through a library such as TanStack Query (chapter 6)

::tryit{custom-hooks}
