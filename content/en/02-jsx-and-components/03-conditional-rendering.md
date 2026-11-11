---
title: Conditional Rendering
minutes: 6
summary: |-
  - JSX has no `if` – you use plain JavaScript.
  - Outside the JSX, `if` with an early `return` works fine. A component that should show nothing returns `null`.
  - Either – or: the ternary operator `{loggedIn ? <LogoutButton /> : <LoginForm />}`.
  - Only if: `{condition && <p>…</p>}`. If the left side is falsy, React shows nothing.
  - With many cases, compute the content in a variable first and then put it into the JSX.

  ```tsx
  function StatusMessage({ status }: { status: 'loading' | 'error' | 'done' }) {
    if (status === 'loading') return <p>Loading …</p>;
    if (status === 'error') return <p>Error!</p>;
    return <p>Done.</p>;
  }
  ```

  > [!WARNING] `{messages.length && <p>…</p>}` shows a **0** for an empty list – compare explicitly: `messages.length > 0 &&`.
quiz:
  - question: "What does `{count && <p>New</p>}` show when `count` is 0?"
    options: ["Nothing","`false`","A 0","An error"]
    answer: 2
    explanation: "`0 && …` evaluates to `0`, and React renders numbers. Better to write `count > 0 && …`."
  - question: "How does a component make sure it displays nothing at all?"
    options: ["`return 0`","Call `hide()`","Set `this.visible = false`","`return null`"]
    answer: 3
    explanation: "`null` renders nothing (so do `false` and `undefined`). A `0`, on the other hand, would be shown as a number."
---

# Conditional Rendering

JSX has no `if` of its own. You use regular JavaScript. Three patterns cover almost everything.

## if with an early return

Outside of JSX, you can use `if` as usual:

```tsx
function StatusMessage({ status }: { status: 'loading' | 'error' | 'done' }) {
  if (status === 'loading') return <p>Loading …</p>;
  if (status === 'error') return <p>Error!</p>;
  return <p>Done.</p>;
}
```

If a component should display nothing at all, it returns `null`.

## Ternary operator: either or

```tsx
<h1>{loggedIn ? 'Welcome back!' : 'Please sign in'}</h1>

{loggedIn ? <LogoutButton /> : <LoginForm />}
```

## && – only if

```tsx
{messages.length > 0 && <p>You have {messages.length} new messages.</p>}
```

If the left side is falsy, React displays nothing.

> [!WARNING]
> Be careful with numbers on the left of `&&`: with `{messages.length && <p>…</p>}` and an empty list, a **0** appears on the page. Compare explicitly instead: `messages.length > 0 &&`.

## Preparing in variables

When it gets messy, compute the content beforehand in a variable:

```tsx
let content;
if (isAdmin) content = <AdminPanel />;
else if (isLoggedIn) content = <Dashboard />;
else content = <LoginForm />;

return <main>{content}</main>;
```

::tryit{conditional-rendering}
