---
title: Props
minutes: 8
summary: |-
  - With props, a parent component passes data to its children, much like attributes in HTML.
  - Strings go in quotes, everything else in `{ }`: `price={3.5}`. An attribute without a value (`onSale`) is `true`.
  - The component receives all props as one object, usually destructured right in the parameter list. With TypeScript you describe them as a type; optional props get `?` and a default value.
  - Props are read-only: same props, same result. Anything that should change is state.
  - The content between the opening and closing tag arrives as `children` (type `ReactNode`) – ideal for wrapper components.
  - `<Avatar {...props} />` passes all props along. Use it sparingly; explicit props are easier to read.

  ```tsx
  type ProductCardProps = {
    name: string;
    price: number;
    onSale?: boolean;
  };

  function ProductCard({ name, price, onSale = false }: ProductCardProps) {
    return (
      <article>
        <h2>{name}</h2>
        <p>{price.toFixed(2)} € {onSale && <strong>On sale!</strong>}</p>
      </article>
    );
  }
  ```
quiz:
  - question: "Can a component change its props?"
    options: ["No, props are read-only","Yes, any time","Only numbers and strings","Only with `setProps`"]
    answer: 0
    explanation: "Props belong to the parent component. Anything that should change is state, which you'll cover in chapter 3."
  - question: "How do you pass a number as a prop?"
    options: ["`price=\"3.5\"`", "`price={3.5}`", "`price=(3.5)`", "`:price=\"3.5\"`"]
    answer: 1
    explanation: "In quotes it is always a string. You pass everything else in curly braces."
  - question: "What is the prop called that contains the content between the opening and closing tag?"
    options: ["`content`", "`slot`", "`children`", "`inner`"]
    answer: 2
exercise:
  example: ex-props
  title: A team badge
  task: |-
    1. `UserBadge` should use its props: the name in `<strong>`, the role in `<span className="role">`.
    2. If no role is passed, the badge shows **Member**.
    3. In `App`, show three badges: **Ada** (Admin), **Linus** (no role) and **Grace** (Editor).
  checks:
    shows-name: The badge shows the name that was passed in
    shows-role: The badge shows the role that was passed in
    default-role: Without a role, it shows **Member**
    three-badges: The app shows Ada Admin, Linus Member, Grace Editor
---

# Props

With **props** (short for *properties*), a parent component passes data to its children, just like attributes on HTML elements.

## Passing and reading props

```tsx
<ProductCard name="Coffee" price={3.5} onSale />
```

- Strings go in quotes, everything else in `{ }`.
- An attribute without a value (`onSale`) is `true`.

The component receives all props as **one object**. Usually you destructure it right in the parameter list:

```tsx
type ProductCardProps = {
  name: string;
  price: number;
  onSale?: boolean;
};

function ProductCard({ name, price, onSale = false }: ProductCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{price.toFixed(2)} € {onSale && <strong>Sale!</strong>}</p>
    </article>
  );
}
```

With TypeScript, you describe props as a type. Optional props get a `?`, and `= false` gives them a **default value**.

## Props are read-only

A component must never modify its props. It behaves like a pure function: same props, same result. If something should change, the parent passes new props, or the component manages its own **state** (chapter 3).

## children

Whatever sits between the opening and closing tag arrives as the **`children`** prop. This is how you build wrapper components like cards, panels or layouts:

```tsx
import type { ReactNode } from 'react';

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  );
}

<Panel title="Shop">
  <ProductCard name="Coffee" price={3.5} />
</Panel>
```

## Forwarding props

With the spread operator, you forward all props at once: `<Avatar {...props} />`. This is handy, but use it sparingly, because explicit props are easier to read.

::tryit{props}
