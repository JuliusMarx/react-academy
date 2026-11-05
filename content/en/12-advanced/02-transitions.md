---
title: Transitions and Deferred Values
minutes: 8
summary: |-
  - Transitions mark updates as non-urgent: React handles the urgent part first, such as the input field, and renders the rest in the background, interruptibly.
  - `useDeferredValue(query)` returns a version that may lag behind. React first renders with the old value, then with the new one in the background – if you keep typing, it aborts and starts over.
  - When `query !== deferredQuery`, the list still shows old results – a good moment to dim it.
  - If you call the setter yourself, use `useTransition`: `startTransition(() => setTab('reports'))`. The old view stays usable, and `isPending` shows that something is happening.
  - Rule of thumb: your own setter → `useTransition`; value from outside (prop, input) → `useDeferredValue`.

  ```tsx
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  <input value={query} onChange={(e) => setQuery(e.target.value)} />
  <div style={{ opacity: isStale ? 0.5 : 1 }}>
    <SlowList query={deferredQuery} />
  </div>
  ```

  > [!WARNING] The slow component must be wrapped in `memo` (or the React Compiler must be active) – otherwise it still re-renders during the urgent render.
quiz:
  - question: "What does `useDeferredValue(query)` do?"
    options: ["It delays every input by one second","It makes the component asynchronous","It stores `query` in `localStorage`","It returns a version of `query` that is allowed to lag behind during expensive updates – the input itself stays smooth"]
    answer: 3
  - question: "When do you use `useTransition` instead of `useDeferredValue`?"
    options: ["When you call the state setter yourself and want to mark the change as not urgent", "Never, they are the same", "Only for network requests", "Only in class components"]
    answer: 0
  - question: "Why does `useDeferredValue` only help together with `memo` for the slow list?"
    options: ["Because `memo` makes the list render faster", "So the list can be skipped during the urgent render with the old value – otherwise it renders every time anyway", "It is not necessary", "Because `useDeferredValue` would throw an error otherwise"]
    answer: 1
exercise:
  example: ex-deferred
  title: A Smooth Search
  task: |-
    The results list takes about 150 ms for every render – the input field stutters while typing.

    1. Give `SlowResults` a deferred version of the search: `useDeferredValue(query)`.
    2. While the list still shows an older search term, `<div id="list">` gets the class `stale`.
  checks:
    filters: The search **ber** shows Berlin and Bern
    stale-class: "`#list` gets `stale` while the list is out of date"
    uses-deferred: "`SlowResults` receives the value from `useDeferredValue`"
---

# Transitions and Deferred Values

Some updates are expensive: filtering a long list, redrawing a chart, switching to a page with many components. Normally React renders every update immediately and completely – and during that time the page doesn't respond. With **transitions** you mark updates as **not urgent**. React then takes care of the urgent part first (such as the input field) and renders the rest in the background, interruptibly.

## useDeferredValue

```tsx
import { useDeferredValue, useState } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SlowList query={deferredQuery} />
      </div>
    </>
  );
}
```

- While you type, React first renders with the **old** `deferredQuery` – the input field updates immediately.
- Then React renders again in the background with the new value. If you keep typing, that render is abandoned and started over.
- When `query !== deferredQuery`, the list is still showing old results – a good moment to gray it out a bit.

> [!WARNING]
> The slow component must be wrapped in `memo` (or the React Compiler must be active). Otherwise it still re-renders during the urgent render – just with the old value, and the benefit is gone.

## useTransition

When you call the state setter yourself, you mark the change with **`startTransition`**:

```tsx
const [tab, setTab] = useState('home');
const [isPending, startTransition] = useTransition();

<button onClick={() => startTransition(() => setTab('reports'))}>Reports</button>
{isPending && <Spinner />}
```

While the new page renders, the old one stays usable, and `isPending` shows that something is happening. If you click somewhere else in the meantime, React discards the render it had started.

## Which one when?

| Situation | Tool |
|---|---|
| You call the setter yourself (tab switch, navigation) | `useTransition` / `startTransition` |
| The value comes from outside, e.g. as a prop or from an input | `useDeferredValue` |
| Loading data without replacing the old content with a fallback | `startTransition` (Chapter 6) |

::tryit{transitions}
