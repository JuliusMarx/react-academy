---
title: Portals
minutes: 6
summary: |-
  - `createPortal(jsx, element)` from `react-dom` renders into a different place in the DOM, usually `document.body` – so an `overflow: hidden` or a `z-index` higher up can't clip your dialog.
  - Only the DOM tree changes: for React, the portal stays a normal child and receives props and context like any other.
  - Events bubble up the React tree: a click inside the dialog also triggers the parent component's `onClick`.
  - An accessible dialog needs `role="dialog"`, `aria-modal="true"` and a title via `aria-labelledby`.
  - Also: move focus into the dialog on open and back on close, **Escape** closes it, and Tab can't leave it (focus trap).

  ```tsx
  function Modal({ children, onClose }: ModalProps) {
    return createPortal(
      <div className="backdrop">
        <div role="dialog" aria-modal="true">
          {children}
          <button onClick={onClose}>Close</button>
        </div>
      </div>,
      document.body,
    );
  }
  ```

  > [!TIP] The HTML `<dialog>` element with `showModal()` already handles focus, Escape and the top layer by itself – no portal needed.
quiz:
  - question: "Where does `createPortal(<Dialog />, document.body)` render the dialog?"
    options: ["Into the parent component", "Directly into `document.body` – outside the parent component's DOM tree", "Into a new window", "Nowhere, you still need `render()`"]
    answer: 1
  - question: "A click inside the portal – who receives the React event?"
    options: ["Only `document.body`","Nobody","The React parents, like with any other child – events follow the React tree, not the DOM","Only the portal itself"]
    answer: 2
exercise:
  example: ex-portal
  title: A Dialog via Portal
  task: |-
    The dialog is rendered inside `<main>` – there, `overflow: hidden` clips it.

    1. Render it into `document.body` with `createPortal` (from `react-dom`).
    2. **Escape** calls `onClose` – via a `keydown` listener on `window` in an Effect, with cleanup.
  checks:
    renders-in-body: The dialog ends up in `document.body`, not in `#root`
    close-button: "**Close** closes the dialog"
    escape-closes: "**Escape** closes the dialog"
---

# Portals

Normally, everything a component renders ends up in the DOM inside its parent component. For dialogs, tooltips, and notifications that is often a problem: an `overflow: hidden` or a `z-index` further up clips or covers them. With a **portal** you render to a completely different place in the DOM.

## createPortal

```tsx
import { createPortal } from 'react-dom';

function Modal({ children, onClose }: ModalProps) {
  return createPortal(
    <div className="backdrop">
      <div role="dialog" aria-modal="true">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}
```

The first argument is the JSX, the second is the DOM element it goes into – usually `document.body` or a dedicated container like `<div id="modal-root">`.

## Elsewhere in the DOM, in place in React

A portal only leaves the **DOM** tree. For React, it remains a perfectly normal child of its parent component:

- It receives **props** and **context** like any other child.
- **Events** bubble up the React tree: a click in the dialog also triggers the parent component's `onClick`, even though the dialog isn't inside it in the DOM.

## Accessible dialogs

A dialog needs more than the right position:

- `role="dialog"`, `aria-modal="true"`, and a title via `aria-labelledby`.
- Move **focus** into the dialog when it opens, and back to the triggering button when it closes.
- **Escape** closes the dialog.
- Focus should not leave the dialog when tabbing (*focus trap*).

> [!TIP]
> The HTML `<dialog>` element with `showModal()` already handles focus, Escape, and the top layer by itself – no portal needed. For more complex cases, headless libraries like Radix UI help (chapter 9).

::tryit{portals}
