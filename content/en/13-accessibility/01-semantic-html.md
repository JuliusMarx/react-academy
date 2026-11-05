---
title: Semantic HTML in JSX
minutes: 8
summary: |-
  - Accessibility starts with the right HTML element. Native elements come with a role, focus and keyboard support built in.
  - Anything clickable is a `<button>`, not a `<div onClick>`. A `<div>` can't be reached with Tab, ignores Enter and Space and has no role. Navigation is an `<a href>`.
  - Every form field needs a label: wrap the field in a `<label>`, or connect `<label htmlFor>` and `id`. In JSX the attribute is called `htmlFor`.
  - Headings `<h1>`–`<h6>` form the outline, without skipping levels. Landmarks like `<header>`, `<nav>`, `<main>` and `<footer>` let users jump straight to an area.
  - Images need `alt`: a description for informative images, `alt=""` for decorative ones.
  - Use fragments `<>…</>` instead of wrapper `<div>`s where structure matters – e.g. directly inside `<ul>`, `<table>` or `<dl>`.

  ```tsx
  <main>
    <h1>Settings</h1>
    <label htmlFor="email">Email</label>
    <input id="email" type="email" />
    <button onClick={save}>Save</button>
  </main>
  ```
quiz:
  - question: "Why is `<button onClick={save}>` better than `<div onClick={save}>`?"
    options: ["There is no difference as long as it looks the same","A `<div>` can't have an `onClick`","The `<button>` renders faster","The `<button>` can be reached with Tab, reacts to Enter and Space and is announced as a button – without any extra code"]
    answer: 3
    explanation: "Native elements come with a role, focus and keyboard support. With a `<div>` you would have to rebuild `role`, `tabIndex` and `onKeyDown` yourself."
  - question: "How do you connect a label to an input that isn't inside the label in JSX?"
    options: ["`<label htmlFor=\"email\">` and `<input id=\"email\" />`","`<label for=\"email\">`","`<label name=\"email\">`","You can't, the input has to be inside the label"]
    answer: 0
  - question: "Which `alt` text does a purely decorative image get?"
    options: ["The file name","`alt=\"\"` – empty, so screen readers skip it","No `alt` attribute at all","`alt=\"Image\"`"]
    answer: 1
---

# Semantic HTML in JSX

Accessibility (a11y for short) means everyone can use your app – with a mouse, with the keyboard only, with a screen reader, with magnification. The biggest lever for that isn't special knowledge but the right HTML element. JSX is HTML – everything you know about good HTML applies here too.

## Native elements first

A `<div>` with `onClick` looks like a button, but it isn't one:

```tsx
// ✗ No focus, no keyboard, no role
<div className="button" onClick={save}>Save</div>

// ✓ Everything built in
<button onClick={save}>Save</button>
```

| What the `<button>` brings | `<div onClick>` |
|---|---|
| reachable with Tab | no |
| Enter and Space trigger it | no |
| screen reader says "button" | no |
| `disabled` blocks it | no |

This applies to all elements: links to other pages are `<a href>`, choices are `<select>` or `<input type="checkbox">`, forms are `<form>`. You could rebuild all that with `role`, `tabIndex` and keyboard handlers – but only with a lot of effort and room for mistakes.

> [!TIP]
> Inside a `<form>`, every `<button>` submits the form. If it shouldn't, give it `type="button"`.

## Labels

Every form field needs a label. The screen reader announces it when the field gets focus, and clicking it focuses the field. Two ways:

```tsx
// Field inside the label
<label>
  <input type="checkbox" /> Remember me
</label>

// Label and field connected by id
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

In JSX the attribute is `htmlFor`, not `for` – just like `className` instead of `class`. A `placeholder` doesn't replace a label: it disappears as you type and isn't announced everywhere.

## Headings and landmarks

Screen reader users often jump from heading to heading. So:

- One `<h1>` per page, below it `<h2>`, `<h3>` … without skipping levels.
- The level follows the outline, not the font size you want – that's what CSS is for.

**Landmarks** mark the big areas of a page. Users can jump straight to them:

| Element | Landmark |
|---|---|
| `<header>` | banner (the page header) |
| `<nav>` | navigation |
| `<main>` | main – once per page |
| `<aside>` | complementary |
| `<footer>` | contentinfo (the page footer) |
| `<section>` with a name | region |

`<header>` and `<footer>` only count as landmarks at the top level – inside `<main>`, `<article>` or `<section>` they are plain groups. If there are several `<nav>`s, tell them apart with a name: `<nav aria-label="Main menu">`.

## Images

Every `<img>` needs `alt`:

```tsx
<img src={chart} alt="Sales doubled from 10 to 20" />
<img src={ornament} alt="" />
```

For informative images, `alt` describes the content – not "image of …". Decorative images get an **empty** `alt=""`, so screen readers skip them. Without any `alt`, some read out the file name.

## Wrapper divs that break structure

A component has to return a single element. But a `<div>` around everything sometimes breaks the structure:

```tsx
// ✗ <div> directly inside <ul> – no longer a valid list
function Items() {
  return (
    <div>
      <li>Apples</li>
      <li>Pears</li>
    </div>
  );
}

// ✓ <>…</> adds no element of its own
function Items() {
  return (
    <>
      <li>Apples</li>
      <li>Pears</li>
    </>
  );
}
```

The same goes for `<tr>` in tables and `<dt>`/`<dd>` in `<dl>`. If you need a `key` in a list, write `<Fragment key={id}>`.

Try it: Tab through the page. The `<div>` button is skipped, the real button reacts to Enter and Space.

::tryit{semantic-html}
