---
title: Form Actions
minutes: 7
summary: |-
  - Since React 19 you pass a function to `<form action={fn}>`. It is called on submit with a `FormData` object.
  - Every field with a `name` is in it: `formData.get('title')`. No `preventDefault` needed.
  - The action may be async. React runs it as a transition, so the page stays responsive.
  - When the action finishes, React resets the form: uncontrolled fields are empty again or back to their `defaultValue`.
  - You only need state per field if you want to react while typing (live preview, character counter).
  - A button can have its own action with `formAction={fn}`, e.g. for "Delete".

  ```tsx
  function NewTodo() {
    async function addTodo(formData: FormData) {
      await saveTodo(String(formData.get('title')));
    }

    return (
      <form action={addTodo}>
        <input name="title" aria-label="Title" />
        <button type="submit">Add</button>
      </form>
    );
  }
  ```
quiz:
  - question: "What does a function you pass to `<form action={…}>` receive?"
    options: ["The submit event","The component's state","A `FormData` object with the form's fields","Nothing"]
    answer: 2
  - question: "What happens to uncontrolled fields after a form action finishes?"
    options: ["They keep their value","The page reloads","They are disabled","React resets the form automatically"]
    answer: 3
  - question: "How do you read the value of the field `<input name=\"email\" />` in an action?"
    options: ["`formData.get('email')`","`formData.email`","`event.target.email`","`useState('email')`"]
    answer: 0
exercise:
  example: ex-form-action
  title: A newsletter form
  task: |-
    The form still uses `onSubmit`, `preventDefault` and a controlled field. Convert it to a form action:

    1. Pass a function to `<form action={…}>`. It receives the `FormData`.
    2. Give the field `name="email"` and read the value with `formData.get('email')`.
    3. Await `subscribe(email)` and then show **Subscribed: …** in `#message`.

    You no longer need state for the input – React clears the field itself after the action.
  checks:
    subscribes: "After submitting, it shows **Subscribed: ada@example.com**"
    resets: The input field is empty afterwards
    uses-action: "`<form action={…}>` with `name=\"email\"`, without `onSubmit`"
---

# Form Actions

So far you have built forms with `onSubmit`, `e.preventDefault()` and state for every field. Since React 19 it is simpler: you pass the form an **action** – a function that is called with the form data on submit.

## A function as the action

```tsx
function NewTodo() {
  async function addTodo(formData: FormData) {
    const title = String(formData.get('title'));
    await saveTodo(title);
  }

  return (
    <form action={addTodo}>
      <input name="title" />
      <button type="submit">Add</button>
    </form>
  );
}
```

- The function receives a **`FormData`** object. Every field with a `name` is in it: `formData.get('title')`.
- No `preventDefault`: React prevents the page reload itself.
- The action may be **asynchronous**. React runs it as a transition – the page stays responsive while it runs.
- When the action finishes, **React resets the form**: uncontrolled fields are empty again or back to their `defaultValue`.

## Controlled or not?

With actions, many forms no longer need state per field. The values live in the DOM and arrive via `FormData` on submit. Controlled fields (`value` + `onChange`) are still worth it when you want to react while the user types: live preview, character counter, showing and hiding fields.

## Multiple buttons

A button can have its own action – handy for “Save” and “Delete” in the same form:

```tsx
<form action={save}>
  <input name="title" />
  <button type="submit">Save</button>
  <button type="submit" formAction={remove}>Delete</button>
</form>
```

## Server Functions

In frameworks like Next.js, an action can also be a **Server Function** (marked with `'use server'`). The code then runs on the server, and the form even works before the JavaScript has loaded. The pattern on the client stays the same.

::tryit{form-actions}
