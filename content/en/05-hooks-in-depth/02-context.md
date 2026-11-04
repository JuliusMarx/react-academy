---
title: Context
minutes: 8
quiz:
  - question: "What problem does Context solve?"
    options: ["Having to pass props through many levels (prop drilling)","Slow components","Missing types","Loading data from the server"]
    answer: 0
  - question: "What value does `useContext(ThemeContext)` return when there is no provider above it?"
    options: ["`undefined`", "The default value from `createContext`", "An error", "The value of the next sibling"]
    answer: 1
  - question: "How do you provide a context value in React 19?"
    options: ["`ThemeContext.set(theme)`","`provide(ThemeContext, theme)`","`<ThemeContext value={theme}>…</ThemeContext>`","`useContext(ThemeContext, theme)`"]
    answer: 2
    explanation: "Since React 19, the context itself is the provider. The older `<ThemeContext.Provider>` still works."
exercise:
  example: ex-context
  title: A Color Scheme for All Buttons
  task: |-
    1. `ThemedButton` still receives the color scheme as a prop. Read it with `useContext(ThemeContext)` from `src/theme.ts` instead.
    2. In `App`, provide the current color scheme to everything below it with `<ThemeContext value={…}>`.
  checks:
    reads-context: "`ThemedButton` reads the value from the context"
    default-light: Without a provider, the button is **light**
    toggles: "**Toggle theme** switches both buttons to **dark**"
---

# Context

Some data is needed by many components: the color scheme, the signed-in user, the language. Passing it through every level via props (*prop drilling*) is tedious. **Context** makes a value available to an entire subtree.

## In three steps

**1. Create the context** – with a default value:

```ts
import { createContext } from 'react';

export type Theme = 'light' | 'dark';
export const ThemeContext = createContext<Theme>('light');
```

**2. Provide the value** – everything inside receives it:

```tsx
export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <ThemeContext value={theme}>
      <Layout />
    </ThemeContext>
  );
}
```

**3. Read the value** – at any depth:

```tsx
import { useContext } from 'react';

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Save</button>;
}
```

When the provided value changes, all components that read it re-render.

## Rules

- Without a provider above it, `useContext` returns the **default value** from `createContext`.
- If there are several providers, the **nearest** one above wins.
- Since React 19, `<ThemeContext value>` is itself the provider. In older code you'll see `<ThemeContext.Provider value>` – it still works.
- You can also read a context with `use(ThemeContext)` – unlike `useContext`, even inside an `if`.

## Providing state and functions

Often you provide a value *and* a function to change it, or `state` and `dispatch` from `useReducer`:

```tsx
const TasksContext = createContext<Task[]>([]);
const TasksDispatchContext = createContext<Dispatch<TaskAction>>(() => {});
```

A dedicated provider component plus a small hook (`useTasks()`) that reads the context has proven its worth. That way nobody needs to know how the context is built internally.

> [!WARNING]
> Context is not a replacement for every prop. First pass data down the normal way or use `children`, so that intermediate levels don't have to pass anything along. Context is worth it for values that many components in many places really need.

::tryit{context}
