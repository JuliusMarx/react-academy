---
title: useActionState
minutes: 9
summary: |-
  - `useActionState(action, initialState)` returns `[state, formAction, isPending]`.
  - The action receives the **previous state** and the `FormData`. Whatever it returns becomes the new state.
  - Pass the returned `formAction` to the form, not your own function. `isPending` is `true` while it runs.
  - Return expected errors (invalid input) as state. Thrown errors go to the nearest Error Boundary.
  - React resets the form after **every** action. Return the inputs in the state and set them as `defaultValue` – but not passwords.

  ```tsx
  async function subscribe(prev: State, formData: FormData): Promise<State> {
    const email = String(formData.get('email'));
    if (!email.includes('@')) return { error: 'Please enter a valid email.' };
    await api.subscribe(email);
    return { error: null };
  }

  const [state, formAction, isPending] = useActionState(subscribe, { error: null });

  <form action={formAction}>
    <input name="email" aria-label="Email" />
    {state.error && <p role="alert">{state.error}</p>}
    <button disabled={isPending}>Subscribe</button>
  </form>
  ```

  > [!TIP] Also validate in the browser with `required`, `minLength` or `type="email"` – but that never replaces the check in the action.
quiz:
  - question: "What does `useActionState(action, initialState)` return?"
    options: ["Only the state","`[formData, setFormData]`","A promise","`[state, formAction, isPending]`"]
    answer: 3
  - question: "Which arguments does an action for `useActionState` receive?"
    options: ["The previous state and the `FormData`","Only `formData`","The event and the state","None"]
    answer: 0
  - question: "The action returns a validation error. What happens to the uncontrolled fields?"
    options: ["They automatically keep their value", "React resets the form anyway – return the values in the state and set them as `defaultValue`", "They are marked red", "The page reloads"]
    answer: 1
exercise:
  example: ex-action-state
  title: Comments with validation
  task: |-
    1. Write `addComment` as an action for `useActionState`: `(previousState, formData) => nextState`.
       - If the comment is shorter than 3 characters, the comments stay the same and `error` becomes **Comment is too short**.
       - Otherwise, await `postComment(text)`, append it, and set `error` to `null`.
    2. Call `useActionState(addComment, initialState)` and use the state, action and `isPending`: `<form action={…}>`, the error in `<p id="error">`, and while sending, the button is disabled and shows **Posting …**.
  checks:
    validates: A comment that is too short shows **Comment is too short**
    pending: While sending, the button is disabled and shows **Posting …**
    adds-comment: A valid comment appears in the list
    uses-action-state: "`useActionState` is used"
---

# useActionState

An action on its own returns nothing. Usually, though, you want to show a **result** – an error message, a confirmation – and know whether the action is **currently running**. That is exactly what **`useActionState`** does.

## Basic form

```tsx
import { useActionState } from 'react';

type State = { error: string | null };

async function subscribe(previousState: State, formData: FormData): Promise<State> {
  const email = String(formData.get('email'));
  if (!email.includes('@')) return { error: 'Please enter a valid email.' };
  await api.subscribe(email);
  return { error: null };
}

function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribe, { error: null });

  return (
    <form action={formAction}>
      <input name="email" />
      {state.error && <p role="alert">{state.error}</p>}
      <button disabled={isPending}>{isPending ? 'Sending …' : 'Subscribe'}</button>
    </form>
  );
}
```

- The action receives the **previous state** and the **`FormData`**. Whatever it returns becomes the new state.
- You don't pass your own function to the form, but the returned **`formAction`**.
- **`isPending`** is `true` while the action is running.

## Return errors instead of throwing

You return expected problems such as invalid input as state. That way the form can display them directly. A thrown error, on the other hand, ends up at the nearest error boundary – that is meant for the unexpected.

## Keeping input after an error

React resets the form after **every** completed action – even if it reports an error. So users don't have to retype everything, you return the values in the state as well and set them as `defaultValue`:

```tsx
async function signUp(prev: State, formData: FormData): Promise<State> {
  const name = String(formData.get('name'));
  if (name.length < 2) return { error: 'Name too short', name };
  // …
}

<input name="name" defaultValue={state.name} />
```

You deliberately don't return passwords – they get cleared.

## Validation

For small forms, a check in the action is enough. For many fields, a schema with a library like **Zod**, which you run in the action, pays off. For very large forms with validation while typing, there is **React Hook Form**.

> [!TIP]
> Also validate in the browser with HTML attributes like `required`, `minLength` or `type="email"`. It's free and accessible – but never replaces the check in the action or on the server.

::tryit{action-state}
