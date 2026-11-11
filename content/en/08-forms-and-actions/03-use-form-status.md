---
title: useFormStatus
minutes: 6
summary: |-
  - `useFormStatus` comes from `react-dom` and returns the status of the form the component sits in – no props needed.
  - `pending` is `true` while the action runs. There's also `data` (the submitted `FormData` or `null`), `method` and `action`.
  - With `data` you can show *what* is being saved: `data.get('title')`.
  - Ideal for reusable pieces inside the form: submit buttons, loading indicators, fields that lock while sending.
  - In the component that owns the form, use `isPending` from `useActionState` instead.

  ```tsx
  import { useFormStatus } from 'react-dom';

  function SubmitButton({ children }: { children: string }) {
    const { pending } = useFormStatus();
    return (
      <button type="submit" disabled={pending}>
        {pending ? 'Saving …' : children}
      </button>
    );
  }
  ```

  > [!WARNING] If you call `useFormStatus` in the component that renders the `<form>` itself, `pending` is always `false`.
quiz:
  - question: "Where do you import `useFormStatus` from?"
    options: ["`react`","`react-hook-form`","`react-router`","`react-dom`"]
    answer: 3
  - question: "Which form does `useFormStatus` read the status from?"
    options: ["The `<form>` the component is rendered in","Every form on the page","The form passed as a prop","The most recently submitted form"]
    answer: 0
    explanation: "That is why the component must sit inside the form. It doesn't work in the same component that renders the `<form>`."
exercise:
  example: ex-form-status
  title: A Save Button
  task: |-
    Write `SubmitButton` so that it reads the status of the surrounding form with `useFormStatus()` (from `react-dom`):

    - While saving, it is disabled and shows **Saving …** with the title from the submitted data, e.g. **Saving Holiday …** (`data.get('title')`).
    - Otherwise it shows its `children`.
  checks:
    pending-state: While saving, the disabled button shows **Saving Holiday …**
    back-to-normal: Afterwards it shows **Save** again
    uses-form-status: "`SubmitButton` uses `useFormStatus()`"
---

# useFormStatus

A submit button often sits deep inside a component that has no idea which action is currently running. **`useFormStatus`** gives it the status of the form it sits in – without any props.

## A reusable button

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving …' : children}
    </button>
  );
}

<form action={savePost}>
  <input name="title" />
  <SubmitButton>Publish</SubmitButton>
</form>
```

You can drop the button into any form – it always shows the status of exactly that form.

## What useFormStatus returns

| Property | Meaning |
|---|---|
| `pending` | `true` while the form's action is running |
| `data` | the submitted `FormData` (or `null`) |
| `method` | `'get'` or `'post'` |
| `action` | the action function |

With `data` you can show *what* is currently being saved: `Saving “${data.get('title')}” …`.

> [!WARNING]
> `useFormStatus` only works in a component rendered **inside** the `<form>`. In the component that renders the form itself, it always returns `pending: false`. There, use `isPending` from `useActionState` instead.

## useFormStatus or isPending?

- **`isPending` from `useActionState`**: in the component that owns the form.
- **`useFormStatus`**: in reusable building blocks *inside* the form – buttons, loading indicators, fields that lock while sending.

::tryit{form-status}
