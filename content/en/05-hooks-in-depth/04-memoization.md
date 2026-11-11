---
title: memo, useMemo and useCallback
minutes: 9
summary: |-
  - `memo(Component)` skips rendering as long as all props stay equal (compared with `Object.is`).
  - Objects, arrays, and functions only count as equal if they are the **same** object.
  - `useMemo(fn, deps)` only recomputes when a dependency changes – for expensive calculations or stable values for `memo` children.
  - `useCallback(fn, deps)` keeps the same function; it equals `useMemo(() => fn, deps)`.
  - Measure with the React DevTools Profiler first, then optimize. Often moving state down or using `children` is enough.
  - The **React Compiler** adds memoization automatically at build time – if your code follows the Rules of React.

  ```tsx
  const ProductList = memo(function ProductList({ products, onSelect }: Props) {
    // …
  });

  const visible = useMemo(
    () => products.filter((p) => p.name.includes(query)),
    [products, query],
  );
  const handleSelect = useCallback((id: number) => setSelected(id), []);

  <ProductList products={visible} onSelect={handleSelect} />
  ```
quiz:
  - question: "When does a component wrapped in `memo` skip rendering?"
    options: ["Always","Never, `memo` is only a hint for developers","When it has no state","When all props stayed the same (compared with `Object.is`)"]
    answer: 3
  - question: "Why does `memo` not help when you pass `onSelect={() => setSelected(id)}`?"
    options: ["A new function is created on every render – so the prop is never equal","Arrow functions are forbidden","Because `setSelected` is asynchronous","It does help"]
    answer: 0
    explanation: "With `useCallback` you keep the same function as long as its dependencies don't change."
  - question: "What does the React Compiler do?"
    options: ["It translates JSX into HTML", "It adds memoization automatically, so you usually don't need `memo`, `useMemo` and `useCallback` by hand", "It replaces TypeScript", "It makes Effects unnecessary"]
    answer: 1
exercise:
  example: ex-memo
  title: Avoiding Unnecessary Renders
  task: |-
    Every keystroke in the **Note** field re-renders `ProductList`, even though the list doesn't change.

    1. Wrap `ProductList` in `memo`.
    2. Keep the filtered list stable with `useMemo`.
    3. Keep `handleSelect` stable with `useCallback`.

    Filtering and selecting must keep working.
  checks:
    skips-renders: Typing in **Note** does not re-render `ProductList`
    still-filters: The filter **co** shows Coffee and Cocoa
    still-selects: Clicking **Cocoa** selects product 2
---

# memo, useMemo and useCallback

React is fast – most of the time you don't need to optimize anything. But when a component becomes noticeably slow, there are three tools to save unnecessary work. All of them remember a result (**memoization**).

## memo: skip rendering

When a component re-renders, all its children normally re-render too. With **`memo`**, a child skips rendering as long as its props stay the same:

```tsx
import { memo } from 'react';

const ProductList = memo(function ProductList({ products, onSelect }: Props) {
  // …
});
```

“The same” means: each prop is compared with the previous one using `Object.is`. For numbers and strings this works out of the box – for objects, arrays and functions only if it is the **same** object.

## useMemo: remember values

```tsx
const visible = useMemo(
  () => products.filter((p) => p.name.includes(query)),
  [products, query],
);
```

`useMemo` only recalculates when a dependency has changed. This helps in two cases:

- The calculation is **expensive** (e.g. filtering or sorting thousands of entries).
- The result is passed to a `memo` component and should stay **the same object**.

## useCallback: remember functions

A function you define inside a component is a new one on every render. `useCallback` keeps the same function as long as the dependencies are the same:

```tsx
const handleSelect = useCallback((id: number) => setSelected(id), []);

<ProductList products={visible} onSelect={handleSelect} />
```

`useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`.

## Measure first, then optimize

Memoization itself costs a little time and makes code harder to read. Use it deliberately where you've measured a problem – with the **Profiler** in React DevTools.

A simpler solution often helps too: move state further down so fewer components re-render, or pass content as `children`.

## The React Compiler

The **React Compiler** analyzes your components at build time and adds memoization automatically. In projects that use it, you hardly ever need `memo`, `useMemo` and `useCallback` by hand. You should still know all three – they're in a lot of existing code, and the compiler applies the same ideas.

> [!NOTE]
> The compiler only works with code that follows React's rules: pure components, no mutating props or state, hooks only at the top level. One more reason to stick to them.

::tryit{memo}
