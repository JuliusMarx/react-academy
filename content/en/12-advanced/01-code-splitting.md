---
title: Code Splitting with lazy
minutes: 7
quiz:
  - question: "What does `const Editor = lazy(() => import('./Editor'))` do?"
    options: ["The editor renders more slowly","The editor is removed at build time","The editor's code is only loaded when the component is rendered for the first time","The editor is pre-rendered in the background"]
    answer: 2
  - question: "What else do you need when you render a `lazy` component?"
    options: ["Nothing","A `useEffect`","A router","A `<Suspense>` boundary with a fallback above it"]
    answer: 3
exercise:
  example: ex-lazy
  title: Load a Chart on Demand
  task: |-
    The chart is “heavy” and rarely needed. Only load it when it is displayed:

    1. Replace the static import with `const Chart = lazy(() => import('./Chart'))`.
    2. Wrap `<Chart />` in `<Suspense>` with the fallback `<p id="loading">Loading chart …</p>`.
  checks:
    hidden-at-first: No chart is visible at first
    shows-chart: After clicking **Show chart**, the chart appears
    lazy-import: "It is loaded with `lazy()` and `<Suspense>`, without a static import"
---

# Code Splitting with lazy

When you build your app, Vite bundles it into JavaScript files that the browser has to load before anything shows up. The bigger the app, the longer that takes. With **code splitting** you divide the code up: rarely used parts are only loaded when they are needed.

## lazy and Suspense

```tsx
import { lazy, Suspense, useState } from 'react';

const Editor = lazy(() => import('./Editor'));

function Post() {
  const [editing, setEditing] = useState(false);
  return (
    <>
      <button onClick={() => setEditing(true)}>Edit</button>
      {editing && (
        <Suspense fallback={<p>Loading editor …</p>}>
          <Editor />
        </Suspense>
      )}
    </>
  );
}
```

- `import('./Editor')` is a **dynamic import**: Vite puts the editor in its own file, which is only loaded on demand.
- `lazy` turns it into a component. On its first render it **suspends** until the code has arrived.
- The nearest `<Suspense>` boundary shows its fallback in the meantime.

The file must provide the component as its **default export**. Importantly, `lazy` belongs at the top level of a module, never inside a component – otherwise a new component would be created on every render.

## What is worth splitting?

- **Whole pages** of an app: if someone never clicks “Settings”, they never load it. Routers like React Router offer their own mechanisms for this (`lazy` in the route definition).
- **Large components** with heavy dependencies: editors, charts, maps.
- **Rarely shown parts**: dialogs, admin areas.

Splitting small components gains nothing – every file is a separate request.

> [!TIP]
> The Network tab in your browser's developer tools shows when each file is loaded. `npm run build` also shows how large the individual files are.

::tryit{code-splitting}
