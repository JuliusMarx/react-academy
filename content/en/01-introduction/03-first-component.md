---
title: Your First Component
minutes: 7
quiz:
  - question: "Why must a component name start with a capital letter?"
    options: ["Otherwise React treats `<welcome />` as an HTML element","It's just a style rule","Because of TypeScript","So the file can be found"]
    answer: 0
    explanation: "Lowercase tags like `<div>` are HTML elements to React, while capitalized ones like `<Welcome />` are your own components."
  - question: "Where should you define a component?"
    options: ["Inside another component","At the top level of a file","In `index.html`","Doesn't matter, as long as it's before it's used"]
    answer: 1
    explanation: "A component inside another component is recreated on every render. That is slow and causes its state to be lost."
exercise:
  example: ex-first-component
  title: Your Own Component
  task: |-
    1. Make `Greeting` in `src/Greeting.tsx` return an `<h2 className="greeting">` with the text **Hello from my component!**
    2. Change the heading in `App.tsx` to **My first app**.
    3. Show `Greeting` twice in `App`.
  checks:
    greeting-renders: "`Greeting` shows `h2.greeting` with the correct text"
    heading: The heading is **My first app**
    used-twice: The app shows `Greeting` exactly twice
---

# Your First Component

A **component** is a JavaScript function that returns JSX. That's all there is to it.

## Writing a component

```tsx
function Welcome() {
  return <p>Welcome to React Academy!</p>;
}
```

Two rules:

1. The name starts with a **capital letter**. `<Welcome />` is a component, while React would treat `<welcome />` as an (unknown) HTML element.
2. The function returns **JSX**, or `null` if nothing should be displayed.

## Using a component

You use a component like an HTML tag, as often as you like:

```tsx
export default function App() {
  return (
    <main>
      <h1>Components</h1>
      <Welcome />
      <Welcome />
    </main>
  );
}
```

If a component returns multiple lines of JSX, wrap them in parentheses. Without the parentheses, `return` would end at the end of the line and return nothing.

## Components in their own files

Larger components get their own file and are exported:

```tsx
// Avatar.tsx
export default function Avatar() {
  return <img src="/ada.png" alt="Ada Lovelace" width={64} height={64} />;
}
```

```tsx
// App.tsx
import Avatar from './Avatar';
```

- **Default export** (`export default`): one main component per file, and you can name it freely when importing.
- **Named export** (`export function Avatar`): any number per file, imported with `import { Avatar } from './Avatar'`.

Both are common. What matters is that you stay consistent within a project.

> [!WARNING]
> Never define components *inside* other components. They would be recreated on every render, so React sees a "new" component each time and discards its state.

::tryit{first-component}
