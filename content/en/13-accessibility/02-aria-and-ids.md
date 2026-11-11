---
title: ARIA and IDs
minutes: 9
summary: |-
  - ARIA adds roles (`role`), states and properties (`aria-*`) for screen readers. In JSX you write `aria-*` just like in HTML, with a dash: `aria-expanded={open}`.
  - First rule: if there is a native element, use it. ARIA only changes what gets announced – focus and keyboard support are up to you. “No ARIA is better than bad ARIA.”
  - Useful: `aria-label` for icon buttons, `aria-describedby` for hints and errors, `aria-expanded` for expanding and collapsing, `aria-invalid` for invalid fields, `aria-hidden` for decorative icons.
  - `useId()` generates a unique ID per component instance – for `htmlFor`, `aria-describedby` and friends. Fixed IDs like `"email"` collide as soon as the component is on the page twice.
  - For several IDs, call `useId()` once and append to it: `` `${id}-hint` ``. Don't use it for `key`s and don't rely on its format.
  - `eslint-plugin-jsx-a11y` catches many mistakes right in the editor: missing `alt`, labels without a field, `onClick` on a `<div>`.

  ```tsx
  function PasswordField() {
    const hintId = useId();
    return (
      <>
        <label>
          Password <input type="password" aria-describedby={hintId} />
        </label>
        <p id={hintId}>At least 12 characters.</p>
      </>
    );
  }
  ```
quiz:
  - question: "Why is `<label htmlFor=\"email\">` a problem in a reusable component?"
    options: ["`htmlFor` only works with `useId`","Labels can't have fixed values","If the component is on the page twice, the ID exists twice – the second label points to the wrong field","It isn't, IDs may appear more than once"]
    answer: 2
    explanation: "IDs must be unique on the page. `useId()` generates a separate one for each instance."
  - question: "What happens when you give a `<div>` `role=\"button\"`?"
    options: ["Nothing, `role` isn't allowed in JSX","It behaves exactly like a `<button>`","React throws an error","It is announced like a button – but that doesn't make it focusable or usable with the keyboard"]
    answer: 3
    explanation: "ARIA only changes the semantics. You have to add `tabIndex={0}` and Enter/Space yourself – or just use a `<button>`."
  - question: "What is `useId()` not meant for?"
    options: ["For `key`s in lists","For `htmlFor` and `id`","For `aria-describedby`","For `aria-labelledby`"]
    answer: 0
    explanation: "Keys come from your data. `useId` is for IDs that link elements to each other."
exercise:
  example: ex-text-field
  title: An Accessible Text Field
  task: |-
    `TextField` appears twice in the form – with the fixed ID `"field"`, both labels point to the first input. You can see the hint and the error, but a screen reader doesn't announce them.

    1. Generate the ID with `useId` and use it to connect label and input.
    2. Link the hint with `aria-describedby`.
    3. If there is an error, the input gets `aria-invalid` and `aria-describedby` points to the hint **and** the error (IDs separated by a space).

    To try it out: **Sign up** with an email without `@` shows the error.
  checks:
    label-linked: Both inputs have their own ID and exactly one label
    hint-described: "`aria-describedby` points to the hint"
    error-invalid: With an error the input is `aria-invalid` and also describes the error
---

# ARIA and IDs

Native elements aren't always enough: an icon button has no text, a hint below a field belongs to that field, a menu is open or closed. That's what **ARIA** (*Accessible Rich Internet Applications*) describes – a set of attributes for screen readers and other assistive technologies.

## ARIA in JSX

ARIA consists of roles (`role`), states and properties (`aria-*`). Unlike most attributes, you write `aria-*` in JSX exactly as in HTML, with a dash:

```tsx
<button aria-label="Close" onClick={onClose}>
  <XIcon aria-hidden="true" />
</button>

<button aria-expanded={open} aria-controls="filters" onClick={() => setOpen(!open)}>
  Filters
</button>
<div id="filters" hidden={!open}>…</div>
```

React renders boolean values like `aria-expanded={open}` as `"true"` or `"false"`.

| Attribute | Used for |
|---|---|
| `aria-label` | A name when there is no visible text (icon buttons) |
| `aria-labelledby` | A name taken from another element, e.g. a dialog's heading |
| `aria-describedby` | An additional description: hints, error messages |
| `aria-expanded` | Expanded or collapsed (menus, accordions) |
| `aria-current="page"` | The current link in a navigation |
| `aria-invalid` | A field with an invalid value |
| `aria-hidden="true"` | Hide from screen readers – only for decoration, never for anything focusable |

## No ARIA is better than bad ARIA

That's a principle of the W3C's ARIA guides. ARIA only changes what is **announced** – not how an element **behaves**:

```tsx
// ✗ Announced as a button, but not reachable with Tab and ignores Enter
<div role="button" onClick={save}>Save</div>

// ✓ Does it all by itself
<button onClick={save}>Save</button>
```

A role is a promise: if you write `role="tab"`, you also have to support the arrow keys users expect from tabs. Wrong ARIA is worse than none, because it tells screen reader users something different from what the page does. So:

1. Use a native element if there is one.
2. Add ARIA only where HTML isn't enough.
3. For complex widgets (tabs, combobox, menu), read the matching section of the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) – or use a headless library like Radix UI or React Aria.

## IDs with useId

`htmlFor`, `aria-labelledby` and `aria-describedby` refer to other elements by ID. Fixed IDs go wrong in components: if `<PasswordField />` is on the page twice, every ID exists twice. `useId()` generates a unique ID per instance:

```tsx
import { useId } from 'react';

function PasswordField() {
  const hintId = useId();
  return (
    <>
      <label>
        Password <input type="password" aria-describedby={hintId} />
      </label>
      <p id={hintId}>At least 12 characters.</p>
    </>
  );
}
```

If you need several IDs, call `useId()` once and append something:

```tsx
const id = useId();

<label htmlFor={`${id}-name`}>Name</label>
<input id={`${id}-name`} />
<label htmlFor={`${id}-city`}>City</label>
<input id={`${id}-city`} />
```

- `useId` is a Hook: call it only at the top of the component, not in loops.
- Not for `key`s in lists – those come from your data.
- Don't rely on the format. It has changed before (most recently in React 19.2, to `_r_…_`). With server rendering, `useId` makes sure server and browser generate the same ID.

## eslint-plugin-jsx-a11y

A linter finds many mistakes before the app even runs:

```bash
npm install -D eslint-plugin-jsx-a11y
```

```js
// eslint.config.js
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // … your other rules
  jsxA11y.flatConfigs.recommended,
];
```

Typical messages: `alt-text` (image without `alt`), `label-has-associated-control` (label without a field), `click-events-have-key-events` and `no-static-element-interactions` (`onClick` on a `<div>`), `aria-props` (misspelled `aria-*` attributes).

> [!NOTE]
> As of November 2026, version 6.10 is current and officially supports up to ESLint 9. With ESLint 10, npm reports a peer dependency conflict.

The linter only sees the code, not the rendered page. Whether focus, contrast and announcements work, you check in the browser and with tests – more on that in the next lessons.
