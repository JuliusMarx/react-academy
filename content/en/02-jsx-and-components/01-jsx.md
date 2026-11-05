---
title: JSX
minutes: 7
summary: |-
  - JSX is a syntax extension for writing markup in JavaScript code. Vite translates it into plain function calls.
  - A component returns exactly one root element. Wrap several elements in a fragment `<>…</>`, which doesn't end up in the DOM.
  - Every tag must be closed: `<img />`, `<br />`, `<input />`.
  - Attributes use camelCase, and some have different names: `className`, `htmlFor`, `onClick`, `tabIndex`. `aria-*` and `data-*` stay as in HTML.
  - Inside `{ }` you can put any JavaScript expression – as text or as an attribute value. In `style={{ color: 'red' }}` the inner pair is an object.
  - Values in `{ }` are escaped automatically, which protects against XSS. Write comments as `{/* … */}`.

  ```tsx
  function Card() {
    return (
      <div className="card">
        <h1>{user.firstName} {user.lastName}</h1>
        <img src={`/avatars/${user.lastName}.png`} alt={user.firstName} />
      </div>
    );
  }
  ```

  > [!NOTE] Statements like `if` or `for` aren't allowed inside `{ }` – only expressions that produce a value.
quiz:
  - question: "How do you set a CSS class in JSX?"
    options: ["`class=\"card\"`","`cssClass=\"card\"`","`className=\"card\"`","`style=\"card\"`"]
    answer: 2
    explanation: "`class` is a reserved word in JavaScript, so the attribute is called `className` in JSX."
  - question: "What can go between curly braces `{ }` in JSX?"
    options: ["Only variables","Only strings","Statements like `if` and `for` too","Any JavaScript expression, e.g. `user.name` or `a + b`"]
    answer: 3
    explanation: "Expressions that produce a value are allowed. For conditions, use the ternary operator or `&&`."
  - question: "How do you return two sibling elements without an extra `<div>`?"
    options: ["With a Fragment `<>…</>`", "With an array without keys", "With two `return` statements", "You can't"]
    answer: 0
---

# JSX

**JSX** is a syntax extension for JavaScript that lets you write markup directly in your code. Vite compiles it into regular function calls. JSX looks like HTML, but it follows a few rules of its own.

## Rule 1: One root element

A component returns exactly *one* element. If you need several, wrap them in a `<div>` or, if no extra element should end up in the DOM, in a **Fragment**:

```tsx
function Profile() {
  return (
    <>
      <h1>Ada Lovelace</h1>
      <p>Mathematician</p>
    </>
  );
}
```

## Rule 2: Close all tags

Tags without content need a slash: `<img />`, `<br />`, `<input />`.

## Rule 3: camelCase attributes

You write most attributes in camelCase, and some are named differently than in HTML:

| HTML | JSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |
| `style="color: red"` | `style={{ color: 'red' }}` |

`aria-*` and `data-*` attributes stay the same as in HTML.

## JavaScript with { }

Curly braces can contain any JavaScript **expression**:

```tsx
const user = { firstName: 'Ada', lastName: 'Lovelace', born: 1815 };

function Card() {
  return (
    <div className="card">
      <h1>{user.firstName} {user.lastName}</h1>
      <p>Born {new Date().getFullYear() - user.born} years ago</p>
      <img src={`/avatars/${user.lastName}.png`} alt={user.firstName} />
    </div>
  );
}
```

Curly braces work as text between tags and as attribute values. In `style={{ … }}` there are two pairs: the outer one means "JavaScript goes here", and the inner one is an object.

> [!NOTE]
> Values in `{ }` are escaped automatically. A string containing `<script>` ends up as text on the page, not as HTML, which protects against XSS.

## Comments

```tsx
<div>
  {/* A comment in JSX */}
</div>
```

::tryit{jsx-basics}
