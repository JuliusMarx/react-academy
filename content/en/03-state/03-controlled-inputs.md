---
title: Form Fields
minutes: 7
quiz:
  - question: "What makes an input field “controlled”?"
    options: ["A `name` attribute", "`value` comes from state and `onChange` updates it", "A `<form>` around it", "The `controlled` attribute"]
    answer: 1
  - question: "Which property do you read in `onChange` for a checkbox?"
    options: ["`e.target.value`", "`e.target.checked`", "`e.target.selected`", "`e.checked`"]
    answer: 1
exercise:
  example: ex-signup-form
  title: A Sign-Up Form
  task: |-
    1. Create state for name and email and make both fields controlled (`value` + `onChange`).
    2. `#preview` shows **Hello, Ada!** while typing (when empty: **Hello, stranger!**).
    3. The button is disabled until the name has at least 2 characters and the email contains an **@**. Calculate this directly during rendering – without additional state.
    4. After submitting, `#thanks` shows **Thanks, Ada!** and both fields are empty again.
  checks:
    live-preview: The preview shows the name while typing
    disabled-when-invalid: The button is disabled for invalid input
    enabled-when-valid: The button is enabled for valid input
    submit-resets: After submitting, the thank-you message appears and the fields are empty
---

# Form Fields

For input fields, you have two options: The browser manages the value (**uncontrolled**), or React does (**controlled**).

## Controlled fields

A controlled field gets its value from state and reports every change back:

```tsx
function NameForm() {
  const [name, setName] = useState('');

  return (
    <>
      <label>
        Name <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <p>Hello, {name || 'stranger'}!</p>
    </>
  );
}
```

Because the value lives in state, you can use it right away: display it live, validate it, transform it, or reset it with a button (`setName('')`).

> [!WARNING]
> A field with `value` but without `onChange` is read-only – React immediately resets any input back to the state value.

## Other field types

```tsx
<textarea value={text} onChange={(e) => setText(e.target.value)} />

<select value={plan} onChange={(e) => setPlan(e.target.value)}>
  <option value="free">Free</option>
  <option value="pro">Pro</option>
</select>

<input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
```

For checkboxes and radio buttons, the attribute is **`checked`**, not `value`.

## Validation during rendering

Whether an input is valid is a **derived value** – you simply calculate it:

```tsx
const isValid = name.trim().length >= 2 && email.includes('@');

<button type="submit" disabled={!isValid}>Sign up</button>
```

## Uncontrolled fields

If you only need the value on submit, an uncontrolled field with `defaultValue` and `FormData` is often enough:

```tsx
function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const email = new FormData(e.currentTarget).get('email');
}

<form onSubmit={handleSubmit}>
  <input name="email" defaultValue="" />
</form>
```

You'll learn about modern forms with `<form action>` and `useActionState` in chapter 8.

::tryit{controlled-inputs}
