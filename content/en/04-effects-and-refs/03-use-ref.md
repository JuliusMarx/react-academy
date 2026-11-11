---
title: useRef
minutes: 8
summary: |-
  - `useRef` returns an object `{ current: … }` that stays the same on every render.
  - Changing `ref.current` does **not** trigger a re-render – good for timer IDs or instances of external libraries, not for values shown in JSX.
  - Don't read or write `ref.current` during rendering (except for one-time initialization); do it in event handlers and Effects.
  - With `ref={inputRef}`, React sets `current` to the DOM element. During the first render it is still `null`.
  - Typical uses: focusing, scrolling, measuring size, playing media, embedding maps or charts.
  - Since React 19, `ref` is a regular prop for function components – `forwardRef` is no longer needed.

  ```tsx
  function Search() {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <>
        <input ref={inputRef} />
        <button onClick={() => inputRef.current?.focus()}>Search</button>
      </>
    );
  }
  ```
quiz:
  - question: "What happens when you change `ref.current`?"
    options: ["The component re-renders","The state is reset","React throws an error","Nothing – the value is stored without re-rendering"]
    answer: 3
  - question: "When is `inputRef.current` populated with the DOM element?"
    options: ["After React has inserted the element into the DOM – e.g. in event handlers and Effects","Already during the first render","Never, you need `document.querySelector`","Only in class components"]
    answer: 0
  - question: "How do you pass a ref to your own component in React 19?"
    options: ["Only with `forwardRef`", "As a plain `ref` prop", "You can't", "Via context"]
    answer: 1
exercise:
  example: ex-focus
  title: Focus and Input
  task: |-
    The input is **uncontrolled** (`defaultValue`). Access it through a ref:

    1. Create a ref with `useRef` and attach it to the field with `ref={…}`.
    2. **Focus** puts the cursor in the field.
    3. **Clear** empties the field and focuses it.
    4. **Send** shows the field's current content in `#message`.
  checks:
    focus-button: "**Focus** focuses the field"
    send: "**Send** displays the content"
    clear: "**Clear** empties the field and focuses it"
---

# useRef

Sometimes a component needs a value that persists across renders but should **not trigger a re-render** – or direct access to a DOM element. That is what **refs** are for.

## A ref is a box

```tsx
import { useRef } from 'react';

const intervalRef = useRef<number | null>(null);
```

`useRef` returns an object `{ current: … }`. It is **the same object** on every render. You can read and overwrite `current` – React doesn't notice.

| Aspect | State | Ref |
|---|---|---|
| Change triggers a render | yes | no |
| Changing the value | via the setter | `ref.current = …` |
| Display in JSX | yes | not suitable |

Typical contents: timer IDs, the previous result of a calculation, instances of external libraries.

```tsx
function start() {
  intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
}

function stop() {
  if (intervalRef.current !== null) clearInterval(intervalRef.current);
}
```

> [!WARNING]
> Don't read or write `ref.current` during rendering (except to initialize it once). The result would be unpredictable. Refs belong in event handlers and Effects.

## DOM elements

If you pass a ref to an element's `ref` attribute, React sets `current` to the DOM element:

```tsx
function Search() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Search</button>
    </>
  );
}
```

During the first render, `current` is still `null` – the element only exists afterwards. In event handlers and Effects it is set.

Typical uses: focusing, scrolling (`scrollIntoView`), measuring size, playing media, integrating libraries such as maps or charts.

## Refs on your own components

Since React 19, `ref` is a **regular prop** on function components. You no longer need `forwardRef`:

```tsx
import type { ComponentProps } from 'react';

function TextInput({ ref, ...props }: ComponentProps<'input'>) {
  return <input ref={ref} {...props} />;
}

<TextInput ref={inputRef} placeholder="Name" />
```

::tryit{use-ref}
