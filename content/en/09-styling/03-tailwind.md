---
title: Tailwind CSS
minutes: 8
summary: |-
  - Tailwind combines small **utility classes** directly in JSX, each doing exactly one thing (`px-4`, `rounded-lg`). Unused styles disappear from the build.
  - Setup: install `tailwindcss` and `@tailwindcss/vite`, add `tailwindcss()` as a Vite plugin, put `@import 'tailwindcss';` in your CSS. No `tailwind.config.js` needed.
  - Define your own colors and spacing in CSS with `@theme`.
  - Prefixes like `hover:`, `focus-visible:`, `md:` or `dark:` apply a class only under a condition. Without a prefix it always applies (mobile first).
  - When a combination repeats, turn it into a component (`<Button>`) instead of writing custom CSS classes.

  ```tsx
  const colors = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  <div className="grid gap-4 md:grid-cols-2">
    <span className={`rounded-full px-3 py-1 ${colors[status]}`}>…</span>
  </div>
  ```

  > [!WARNING] Tailwind only finds complete class names – assembled ones like `` `bg-${color}-100` `` are missing from the CSS.
quiz:
  - question: "How do you set up Tailwind CSS 4 in a Vite project?"
    options: ["With a `tailwind.config.js` and PostCSS","With a `<script>` from a CDN","With the `@tailwindcss/vite` plugin and `@import 'tailwindcss'` in the CSS file","Not at all, it's built into React"]
    answer: 2
  - question: "What does `md:grid-cols-2` mean?"
    options: ["Always two columns","Medium column width","Two columns on mobile devices only","Two columns from the `md` breakpoint up (medium-sized screens)"]
    answer: 3
  - question: "Why must you not assemble class names, e.g. `bg-${color}-100`?"
    options: ["Tailwind only generates classes it finds written out in full in the source code","It's a syntax error","Because template strings are forbidden in JSX","You can do that"]
    answer: 0
exercise:
  example: ex-tailwind
  title: Status Badges
  task: |-
    Style `Badge` with Tailwind classes:

    - always: `inline-flex rounded-full px-3 py-1 text-sm font-medium`
    - for `success`: `bg-green-100 text-green-800`
    - for `error`: `bg-red-100 text-red-800`

    Write the color classes out in full, e.g. in an object with one entry per status.
  checks:
    base-classes: The badge has the shared classes
    variants: Each status gets its colors
    tailwind-applies: Tailwind really generates the CSS (12px padding)
---

# Tailwind CSS

**Tailwind CSS** takes a different approach: instead of writing your own classes, you compose small **utility classes** directly in JSX – each does exactly one thing.

```tsx
<button className="rounded-lg bg-sky-700 px-4 py-2 font-medium text-white hover:bg-sky-800">
  Save
</button>
```

`px-4` is horizontal padding, `rounded-lg` a border radius, and `hover:bg-sky-800` a darker color on hover. You no longer write CSS, don't have to invent class names, and styles you stop using disappear from the build automatically.

## Setup

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* src/index.css */
@import 'tailwindcss';
```

That's all Tailwind 4 needs – no `tailwind.config.js`, no PostCSS. You define custom colors and spacing directly in CSS with `@theme`.

## Variants: States and Breakpoints

A prefix applies a class only under a certain condition:

| Prefix | Applies … |
|---|---|
| `hover:`, `focus-visible:`, `disabled:` | in the respective state |
| `md:`, `lg:` | from a screen width upward (mobile first) |
| `dark:` | in the dark color scheme |

```tsx
<div className="grid gap-4 md:grid-cols-2">…</div>
```

Without a prefix, a class always applies – so first for small screens. `md:grid-cols-2` adds two columns from medium width upward.

## Applying Classes Conditionally

> [!WARNING]
> Tailwind scans your source code for **complete** class names. It doesn't find assembled names like `` `bg-${color}-100` `` – the class is then missing from the CSS. Write out every variant:

```tsx
const colors = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
};

<span className={`rounded-full px-3 py-1 ${colors[status]}`}>…</span>
```

## Avoiding Repetition

Long class lists feel unfamiliar at first. When a combination repeats, the answer in React is usually: **turn it into a component** (`<Button>`, `<Badge>`) – not your own CSS classes.

::tryit{tailwind}
