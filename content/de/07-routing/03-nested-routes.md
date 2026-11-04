---
title: Verschachtelte Routen
minutes: 8
quiz:
  - question: "Wo zeigt eine Layout-Route die Seite der passenden Kind-Route an?"
    options: ["Dort, wo sie `<Outlet />` rendert","Unter dem Layout, automatisch","In `children`","Gar nicht, man muss sie importieren"]
    answer: 0
  - question: "Was ist eine Index-Route?"
    options: ["Die erste Route in der Datei", "Die Kind-Route, die gezeigt wird, wenn die URL genau dem Pfad der Eltern-Route entspricht", "Eine Route für `/index.html`", "Eine Route ohne Komponente"]
    answer: 1
  - question: "Warum braucht `<NavLink to=\"/\">` oft das Attribut `end`?"
    options: ["Damit er die Seite neu lädt","Damit er am Ende der Navigation steht","Sonst ist der Link auf jeder Seite aktiv, weil jede URL mit `/` beginnt","Das ist Pflicht für jeden NavLink"]
    answer: 2
exercise:
  example: ex-nested
  title: Ein Dashboard mit Layout
  task: |-
    Jede Dashboard-Seite rendert ihren Kopf selbst – und `Settings` hat ihn vergessen.

    1. Mach `DashboardLayout` zu einer Layout-Route: Es zeigt den Kopf einmal und darunter die aktuelle Seite mit `<Outlet />` in `<main id="page">`.
    2. Verschachtle die Routen unter `path="dashboard"`: Die Index-Route zeigt `Overview`, `settings` zeigt `Settings`. Entferne den doppelten Kopf aus den Seiten.
  checks:
    index-route: "`/dashboard` zeigt den Kopf einmal und die Übersicht"
    child-route: "`/dashboard/settings` zeigt denselben Kopf und die Einstellungen"
    active-nav: Auf der Einstellungsseite ist nur **Settings** aktiv
---

# Verschachtelte Routen

Die meisten Apps haben einen Rahmen, der auf allen Seiten gleich bleibt: Kopfzeile, Navigation, Seitenleiste. Mit **verschachtelten Routen** schreibst du ihn einmal, und nur der Inhalt darin wechselt.

## Layout-Routen und Outlet

Routen lassen sich ineinander schachteln. Die äußere Route rendert ein Layout, und **`<Outlet />`** markiert die Stelle, an der die passende innere Route erscheint:

```tsx
import { NavLink, Outlet, Route, Routes } from 'react-router';

function Layout() {
  return (
    <>
      <header>
        <NavLink to="/" end>Start</NavLink>
        <NavLink to="/settings">Einstellungen</NavLink>
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

- Eine Route **ohne `path`** ist eine reine Layout-Route – sie fügt der URL nichts hinzu.
- Pfade von Kind-Routen sind **relativ** zur Eltern-Route: `settings` unter `/` ergibt `/settings`.
- Beim Seitenwechsel bleibt das Layout stehen, nur der Inhalt im `Outlet` wird ausgetauscht.

## Index-Routen

Eine **Index-Route** (`index` statt `path`) ist die Kind-Route, die erscheint, wenn die URL genau dem Pfad der Eltern-Route entspricht. Ohne sie wäre das `Outlet` auf `/settings` leer:

```tsx
<Route path="settings" element={<SettingsLayout />}>
  <Route index element={<p>Wähle eine Einstellung.</p>} />
  <Route path="profile" element={<Profile />} />
</Route>
```

## Mehrere Ebenen

Layouts lassen sich beliebig tief schachteln: Das App-Layout enthält das Einstellungs-Layout, das wiederum die einzelnen Einstellungsseiten enthält. Jede Ebene rendert ihr eigenes `Outlet`.

> [!TIP]
> `NavLink` ist auch aktiv, wenn die URL nur **mit** seinem Ziel beginnt – `/settings` ist also auch auf `/settings/profile` aktiv. Für Links auf `/` oder Übersichtsseiten setzt du deshalb `end`: Dann zählt nur die exakte URL.

::tryit{nested-routes}
