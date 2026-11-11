---
title: CSS Modules
minutes: 6
summary: |-
  - CSS Modules prevent naming conflicts: each class only applies to the file that imports it.
  - Vite treats every file ending in `.module.css` as a CSS Module.
  - The import gives you an object with the class names: `className={styles.card}`. Vite turns them into unique names like `_card_1a2b3_1`.
  - Pick a variant based on a prop with `styles[variant]`. For many conditions, `clsx` helps.
  - Mark a global selector inside a module with `:global(.class)`.

  ```tsx
  import styles from './Card.module.css';

  export default function Card({ title, children }: CardProps) {
    return (
      <section className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </section>
    );
  }
  ```

  > [!TIP] TypeScript only knows the classes as `string` – typos like `styles.crad` only show up in the browser.
quiz:
  - question: "How does Vite recognize a CSS Module file?"
    options: ["By the `modules/` folder","By a comment at the top of the file","By the `.module.css` extension","By `@module` in the file"]
    answer: 2
  - question: "What does `styles.card` contain after `import styles from './Card.module.css'`?"
    options: ["The CSS code of the class","A style object for `style={…}`","`true`","A unique class name like `_card_1a2b3_1`"]
    answer: 3
exercise:
  example: ex-css-modules
  title: Resolving Conflicts
  task: |-
    The global classes `.card` and `.title` clash with `legacy.css` – the card is pink and dashed.

    1. Rename `Card.css` to `Card.module.css`.
    2. Import it with `import styles from './Card.module.css'`.
    3. Use `className={styles.card}` and `className={styles.title}`.
  checks:
    scoped-class: The card has a unique module class instead of `card`
    own-styles: Its own styles (rounded corners, title color) apply
    no-clash: The styles from `legacy.css` no longer apply
---

# CSS Modules

**CSS Modules** solve the biggest problem of global CSS: name clashes. Every class applies only to the file that imports it.

## How it works

Vite treats a file whose name ends in **`.module.css`** as a CSS Module:

```css
/* Card.module.css */
.card {
  border-radius: 12px;
  padding: 1rem;
}

.title {
  color: #087ea4;
}
```

On import you get an object with the class names:

```tsx
import styles from './Card.module.css';

export default function Card({ title, children }: CardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
```

Vite turns `.card` into a unique name like `_card_1a2b3_1`. Another file can also define `.title` – the two never get in each other's way.

## Multiple classes and variants

```tsx
<button className={`${styles.button} ${styles[variant]}`}>…</button>
```

With `styles[variant]` you pick a class matching a prop. For many conditions, `clsx` helps here too.

## Global exceptions

If you do need a global selector inside a module, for example for a class from a third-party library, mark it with `:global`:

```css
.card :global(.highlight) {
  background: yellow;
}
```

> [!TIP]
> With TypeScript, `styles` knows all class names only as `string` – typos like `styles.crad` only show up in the browser. So keep module files small and next to their component.

::tryit{css-modules}
