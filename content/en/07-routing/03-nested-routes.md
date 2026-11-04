---
title: Nested Routes
minutes: 8
quiz:
  - question: "Where does a layout route show the page of the matching child route?"
    options: ["Where it renders `<Outlet />`","Below the layout, automatically","In `children`","Nowhere, you have to import it"]
    answer: 0
  - question: "What is an index route?"
    options: ["The first route in the file", "The child route that is shown when the URL exactly matches the parent route's path", "A route for `/index.html`", "A route without a component"]
    answer: 1
  - question: "Why does `<NavLink to=\"/\">` often need the `end` attribute?"
    options: ["So it reloads the page","So it appears at the end of the navigation","Otherwise the link is active on every page, because every URL starts with `/`","It is required for every NavLink"]
    answer: 2
exercise:
  example: ex-nested
  title: A dashboard with a layout
  task: |-
    Every dashboard page renders its own header – and `Settings` forgot it.

    1. Turn `DashboardLayout` into a layout route: it shows the header once and the current page below it with `<Outlet />` inside `<main id="page">`.
    2. Nest the routes under `path="dashboard"`: the index route shows `Overview`, `settings` shows `Settings`. Remove the duplicated header from the pages.
  checks:
    index-route: "`/dashboard` shows the header once and the overview"
    child-route: "`/dashboard/settings` shows the same header and the settings"
    active-nav: On the settings page, only **Settings** is active
---

# Nested Routes

Most apps have a frame that stays the same on every page: header, navigation, sidebar. With **nested routes**, you write it once, and only the content inside it changes.

## Layout routes and Outlet

Routes can be nested inside each other. The outer route renders a layout, and **`<Outlet />`** marks the spot where the matching inner route appears:

```tsx
import { NavLink, Outlet, Route, Routes } from 'react-router';

function Layout() {
  return (
    <>
      <header>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

<Routes>
  <Route element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

- A route **without `path`** is a pure layout route – it adds nothing to the URL.
- Child route paths are **relative** to the parent route: `settings` under `/` becomes `/settings`.
- When the page changes, the layout stays in place and only the content in the `Outlet` is swapped.

## Index routes

An **index route** (`index` instead of `path`) is the child route that appears when the URL exactly matches the parent route's path. Without it, the `Outlet` would be empty on `/settings`:

```tsx
<Route path="settings" element={<SettingsLayout />}>
  <Route index element={<p>Choose a setting.</p>} />
  <Route path="profile" element={<Profile />} />
</Route>
```

## Multiple levels

Layouts can be nested as deeply as you like: the app layout contains the settings layout, which in turn contains the individual settings pages. Each level renders its own `Outlet`.

> [!TIP]
> `NavLink` is also active when the URL merely **starts with** its target – so `/settings` is also active on `/settings/profile`. For links to `/` or overview pages, set `end`: then only the exact URL counts.

::tryit{nested-routes}
