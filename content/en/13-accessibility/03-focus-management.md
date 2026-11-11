---
title: Managing Focus
minutes: 9
summary: |-
  - Everything must work with the keyboard. The Tab order follows the DOM. `tabIndex={0}` adds an element to the order, `tabIndex={-1}` makes it focusable only via `focus()`. Avoid positive values.
  - Focus must be visible: style `:focus-visible`, never `outline: none` without a replacement.
  - With a ref and `ref.current?.focus()` you move focus to where things continue after an action – especially when the focused element disappears.
  - Client-side routers like React Router don't move focus after a page change. A common approach: focus the `<h1>` with `tabIndex={-1}`.
  - `<dialog>` with `showModal()` does the hard part: top layer, rest of the page inert, Escape closes, focus moves in and back out on close. In React, open it via a ref and an Effect; `onClose` keeps the state in sync.
  - `inert` (a boolean attribute in React 19) blocks an area for mouse, keyboard and screen readers.

  ```tsx
  useEffect(() => {
    const dialog = ref.current!;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  <dialog ref={ref} onClose={onClose}>…</dialog>
  ```
quiz:
  - question: "What does `dialog.showModal()` do – compared to the `open` prop?"
    options: ["Nothing different, both open a modal dialog", "It opens the dialog as a modal: top layer, rest of the page inert, Escape closes, focus moves inside", "It renders the dialog into `document.body` via a portal", "It prevents the dialog from being closed"]
    answer: 1
    explanation: "`open` only shows the dialog as non-modal. The modal behavior only comes with `showModal()`."
  - question: "What does `tabIndex={-1}` mean?"
    options: ["The element comes first in the Tab order","The element can't be focused at all anymore","The element can be focused via `focus()`, but can't be reached with Tab","The element is hidden from screen readers"]
    answer: 2
  - question: "After clicking “Delete”, the button disappears together with its list item. Where should focus go?"
    options: ["Into the address bar","Nowhere, the browser takes care of it","To the `<body>` element","Via a ref to a sensible place, e.g. the list's heading or the next item"]
    answer: 3
    explanation: "When the focused element disappears, focus lands on `<body>` – keyboard users then have to start from the top."
---

# Managing Focus

If you use the keyboard or a screen reader, you're always at one spot: the **focus**. On classic web pages the browser resets it on every page load. In a React app the page changes without the browser noticing – so you sometimes have to take care of focus yourself.

## Keyboard

Everything that works with the mouse must also work with the keyboard. Native elements (lesson 1) do most of it by themselves. On top of that:

- The **Tab order** follows the order in the DOM. Arrange the DOM the way the page is read – don't reorder it with CSS.
- `tabIndex={0}` adds an element to the Tab order. `tabIndex={-1}` makes it focusable only via `focus()`. Positive values mess up the order – avoid them.
- Focus must be **visible**. If you remove the default outline, replace it:

```css
button:focus-visible {
  outline: 3px solid #087ea4;
  outline-offset: 2px;
}
```

`:focus-visible` applies to keyboard focus, but usually not to a mouse click – so the outline doesn't bother anyone.

Add your own shortcuts with `onKeyDown`:

```tsx
<div role="search" onKeyDown={(e) => e.key === 'Escape' && setQuery('')}>
  <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
</div>
```

## Setting focus with refs

With a ref and `focus()` you send focus to where things continue. Typical cases:

- A field for editing appears → focus into it.
- An item is deleted, together with its button → focus on the list or the next item. Otherwise it lands on `<body>` and keyboard users start from the top.
- A form has errors → focus on the first invalid field.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
const [editing, setEditing] = useState(false);

// The field only exists after rendering – so focus it in an Effect
useEffect(() => {
  if (editing) inputRef.current?.focus();
}, [editing]);
```

Only move focus as a result of an action. If it jumps around on its own, users lose their bearings.

## Focus after a page change

When a client-side router like React Router navigates, focus stays on the clicked link – or lands on `<body>` if the link disappears. A screen reader doesn't announce the change. React Router deliberately doesn't manage focus; that's your job. A common pattern: focus the `<h1>` of the new page.

```tsx
function Page({ title, children }: { title: string; children: ReactNode }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [title]);

  return (
    <main>
      <title>{title}</title>
      <h1 ref={headingRef} tabIndex={-1}>{title}</h1>
      {children}
    </main>
  );
}
```

`tabIndex={-1}` makes the heading focusable without adding it to the Tab order. React 19 hoists the `<title>` element into the `<head>` automatically – so the page title is right, too. On the very first load, focus should usually stay where the browser puts it, so in a real app you skip the first run.

## Dialogs with `<dialog>`

A modal dialog needs a lot: top layer, rest of the page blocked, Escape closes, focus in and back out afterwards. The lesson on portals in chapter 12 showed how much of that you'd have to build by hand. The HTML element `<dialog>` does all of it by itself – if you open it with `showModal()`:

| Behavior | `showModal()` | `open` prop |
|---|---|---|
| top layer, `::backdrop` | yes | no |
| rest of the page inert | yes | no |
| Escape closes | yes | no |
| focus moves inside | yes | no |

The `open` prop only opens the dialog as **non-modal**. So in React you call `showModal()` via a ref in an Effect:

```tsx
function ConfirmDialog({ open, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current!;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} onClose={onClose}>
      {children}
      <form method="dialog">
        <button>Close</button>
      </form>
    </dialog>
  );
}
```

- `onClose` fires on **every** close – Escape included. That keeps your state in sync.
- A button in `<form method="dialog">` closes the dialog without a handler of its own. Its `value` ends up in `dialog.returnValue`.
- `showModal()` puts focus on the first focusable element. If another one should get it, call its `focus()` right after `showModal()`.
- On close, browsers return focus to the element that had it before – usually the button that opened the dialog. If that's gone, set it yourself.
- The dialog gets a title via `aria-labelledby`, connected with `useId`.

Try it with the keyboard only: Tab to a **Delete** button, Enter, then Escape or **Delete**. After deleting, focus lands on the heading.

::tryit{dialog-focus}

## inert

For your own overlays – a side menu, say – there is the `inert` attribute. Everything inside can no longer be clicked, focused or seen by screen readers:

```tsx
<>
  <SideMenu open={menuOpen} />
  <main inert={menuOpen}>…</main>
</>
```

Since React 19, `inert` is a normal boolean attribute. React 18 didn't know it yet – there it needed workarounds like `inert=""`.
