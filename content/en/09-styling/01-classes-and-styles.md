---
title: Classes and Inline Styles
minutes: 7
summary: |-
  - With Vite you import CSS files directly into a component: `import './App.css'`. They apply to the whole page.
  - `className` takes a string; separate multiple classes with spaces. Build conditional classes with template strings, a ternary or the `clsx` package.
  - `style` takes an **object** with camelCase properties. Numbers become pixels (except for unitless properties like `opacity` or `zIndex`).
  - Inline styles suit values that arise at runtime. `:hover`, `:focus` and media queries don't work with them.
  - Middle ground: the styling lives in CSS, only the value comes from React as a CSS variable.

  ```tsx
  import clsx from 'clsx';

  <button className={clsx('tab', { active: isActive, disabled: !enabled })}>…</button>

  <div style={{ width: `${progress}%`, marginTop: 8 }} />

  <p className="swatch" style={{ '--swatch': color } as CSSProperties}>…</p>
  ```

  > [!WARNING] Regular CSS files are global: two classes named `.card` override each other.
quiz:
  - question: "How do you write the CSS property `background-color` as an inline style in JSX?"
    options: ["`style=\"background-color: red\"`", "`style={{ backgroundColor: 'red' }}`", "`style={{ 'background-color': red }}`", "`css={{ background: red }}`"]
    answer: 1
  - question: "When do you use inline styles instead of classes?"
    options: ["For everything – they are faster","For hover effects","For values computed at runtime, e.g. a width in percent","For media queries"]
    answer: 2
    explanation: "Pseudo-classes like `:hover` and media queries don't work with inline styles at all. For anything static, classes are better."
exercise:
  example: ex-class-names
  title: Tabs and Progress Bar
  task: |-
    1. Every tab has the class `tab`, and the active one additionally has `active`.
    2. Clicking a tab makes it the active one.
    3. `ProgressBar` sets the width of `.bar` via an inline style to `percent` percent – but never more than 100 % and never less than 0 %.
  checks:
    tab-classes: All tabs have `tab`, and initially only **Profile** is active
    switches: Clicking **Settings** makes Settings active
    bar-width: "`percent={40}` results in `width: 40%`"
    bar-clamped: Values above 100 and below 0 are clamped
---

# Classes and Inline Styles

React doesn't dictate how you style. The foundation is plain CSS – you connect it via `className` or set styles directly with `style`.

## CSS Files and className

With Vite you import CSS files directly into a component. They then apply to the whole page:

```tsx
import './App.css';

function Alert({ children }: { children: string }) {
  return <p className="alert">{children}</p>;
}
```

`className` takes a string. Separate multiple classes with spaces: `className="alert alert-danger"`.

## Applying Classes Conditionally

You often set classes depending on props or state:

```tsx
<p className={`alert alert-${variant}`}>…</p>

<button className={isActive ? 'tab active' : 'tab'}>…</button>
```

With several conditions this quickly gets messy. For that there is the tiny package **clsx**:

```tsx
import clsx from 'clsx';

<button className={clsx('tab', { active: isActive, disabled: !enabled })}>…</button>
```

## Inline Styles

The `style` attribute takes an **object**. You write properties in camelCase, and numbers become pixels (except for unitless properties like `opacity`, `zIndex` or `lineHeight`):

```tsx
<div style={{ width: `${progress}%`, marginTop: 8, backgroundColor: color }} />
```

Inline styles suit **values that arise at runtime**: widths, positions, a color from your data. For everything else, classes are better – `:hover`, `:focus` and media queries don't work with inline styles at all.

## CSS Variables

A good middle ground: the styling lives in CSS, and only the value comes from React.

```tsx
<p className="swatch" style={{ '--swatch': color } as CSSProperties}>…</p>
```

```css
.swatch {
  border-left: 8px solid var(--swatch);
}
```

> [!WARNING]
> Regular CSS files are **global**. If a class is called `.card` in two files, they override each other – no matter which component imports them. The next lesson shows how CSS Modules prevent this.

::tryit{styling-basics}
