---
title: Routes and Links
minutes: 8
summary: |-
  - Install `react-router`. The `react-router-dom` package no longer exists as of version 8.
  - `<BrowserRouter>` connects the router to the address bar and goes once, at the very outside.
  - `<Routes>` shows the `element` of the `<Route>` that matches the URL. Order doesn't matter – the most specific one wins. `path="*"` catches everything else (404 page).
  - `<Link to="…">` changes the page without a reload: state and loaded data are kept.
  - `<NavLink>` gets the class `active` and `aria-current="page"` on the current page.
  - `<Navigate to="/" replace />` redirects. `replace` replaces the entry in the history.

  ```tsx
  import { BrowserRouter, NavLink, Route, Routes } from 'react-router';

  <BrowserRouter>
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  ```

  > [!WARNING] If someone opens `/about` directly, the server must serve `index.html` (Netlify: `/* /index.html 200`), otherwise you get a 404.
quiz:
  - question: "In React Router 8, which package do you import `BrowserRouter`, `Routes` and `Link` from?"
    options: ["`react-router-dom`","`@react-router/browser`","`react-router`","`react-dom/router`"]
    answer: 2
    explanation: "As of v8, `react-router-dom` no longer exists. Everything comes from `react-router`, except `RouterProvider`, which comes from `react-router/dom`."
  - question: "Why use `<Link to=\"/about\">` instead of `<a href=\"/about\">`?"
    options: ["Links are faster to type","For accessibility","`<a>` doesn't work in React","A link changes the page without a reload – state and loaded data are preserved"]
    answer: 3
  - question: "What is the difference between `Link` and `NavLink`?"
    options: ["`NavLink` knows whether it points to the current page and then sets `class=\"active\"` and `aria-current`","`NavLink` reloads the page","`NavLink` only works inside `<nav>`","There is none"]
    answer: 0
exercise:
  example: ex-routes
  title: A website with three pages
  task: |-
    1. Wrap everything in `<BrowserRouter>` and show the pages with `<Routes>`/`<Route>`: `/` → `Home`, `/about` → `About`, `/contact` → `Contact`, everything else → `NotFound`.
    2. Turn the three navigation entries into `<NavLink>`s so the current one gets the class `active`.
  checks:
    home: "`/` shows **Welcome**"
    links-navigate: The links change the URL and the page
    active-link: Only the current link is active
    not-found: Unknown paths show **Page not found**
---

# Routes and Links

A React app is a single HTML page. To still have multiple "pages" with their own URLs – `/`, `/about`, `/products/42` – you need a **router**. The most widely used one is **React Router**.

## Installing

```bash
npm install react-router
```

> [!NOTE]
> Older tutorials mention `react-router-dom`. As of version 8, that package no longer exists – everything comes from `react-router`.

## Defining routes

```tsx
import { BrowserRouter, Route, Routes } from 'react-router';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- **`BrowserRouter`** connects React Router to the browser's address bar. It belongs once, at the very outside.
- **`Routes`** picks the route that matches the current URL and shows its `element`.
- **`path="*"`** matches everything that no other route matches – the 404 page.

The order of routes doesn't matter: React Router always picks the most specific one.

## Links

```tsx
import { Link, NavLink } from 'react-router';

<Link to="/about">About us</Link>
```

A `Link` renders a normal `<a>`, but changes the page **without a reload**: React only swaps the route, and state and loaded data are preserved. With `<a href>`, the whole app would restart.

**`NavLink`** is a link that knows whether it points to the current page. If so, it gets the class `active` and `aria-current="page"` – ideal for navigation:

```tsx
<nav>
  <NavLink to="/">Home</NavLink>
  <NavLink to="/about">About us</NavLink>
</nav>
```

```css
nav a.active {
  font-weight: bold;
}
```

## Redirecting

```tsx
<Route path="/home" element={<Navigate to="/" replace />} />
```

`replace` replaces the current entry in the browser history, so "Back" doesn't land on the redirect again.

> [!WARNING]
> If someone opens `/about` directly (or reloads), the browser asks the server for that address. The server must then serve `index.html`, otherwise you get a 404. On Netlify, a rule `/* /index.html 200` takes care of this; Vite does it automatically in the dev server.

::tryit{routes-basics}
