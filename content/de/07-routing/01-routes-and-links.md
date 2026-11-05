---
title: Routen und Links
minutes: 8
summary: |-
  - Du installierst `react-router`. Das Paket `react-router-dom` gibt es seit Version 8 nicht mehr.
  - `<BrowserRouter>` verbindet den Router mit der Adresszeile und gehört einmal ganz nach außen.
  - `<Routes>` zeigt das `element` der `<Route>`, die zur URL passt. Die Reihenfolge ist egal, es gewinnt die spezifischste. `path="*"` fängt alles Übrige ab (404-Seite).
  - `<Link to="…">` wechselt die Seite ohne Neuladen: State und geladene Daten bleiben erhalten.
  - `<NavLink>` bekommt auf der aktuellen Seite die Klasse `active` und `aria-current="page"`.
  - `<Navigate to="/" replace />` leitet weiter. `replace` ersetzt den Eintrag in der Historie.

  ```tsx
  import { BrowserRouter, NavLink, Route, Routes } from 'react-router';

  <BrowserRouter>
    <nav>
      <NavLink to="/">Start</NavLink>
      <NavLink to="/about">Über uns</NavLink>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  ```

  > [!WARNING] Ruft jemand `/about` direkt auf, muss der Server `index.html` ausliefern (Netlify: `/* /index.html 200`), sonst gibt es einen 404.
quiz:
  - question: "Aus welchem Paket importierst du in React Router 8 `BrowserRouter`, `Routes` und `Link`?"
    options: ["`react-router-dom`","`@react-router/browser`","`react-router`","`react-dom/router`"]
    answer: 2
    explanation: "Seit v8 gibt es `react-router-dom` nicht mehr. Alles kommt aus `react-router`, nur `RouterProvider` aus `react-router/dom`."
  - question: "Warum nimmst du `<Link to=\"/about\">` statt `<a href=\"/about\">`?"
    options: ["Links sind schneller zu tippen","Wegen der Barrierefreiheit","`<a>` funktioniert in React nicht","Ein Link wechselt die Seite ohne Neuladen – State und geladene Daten bleiben erhalten"]
    answer: 3
  - question: "Was ist der Unterschied zwischen `Link` und `NavLink`?"
    options: ["`NavLink` weiß, ob es zur aktuellen Seite führt, und setzt dann `class=\"active\"` und `aria-current`","`NavLink` lädt die Seite neu","`NavLink` funktioniert nur in `<nav>`","Es gibt keinen"]
    answer: 0
exercise:
  example: ex-routes
  title: Eine Website mit drei Seiten
  task: |-
    1. Umhülle alles mit `<BrowserRouter>` und zeige die Seiten mit `<Routes>`/`<Route>`: `/` → `Home`, `/about` → `About`, `/contact` → `Contact`, alles andere → `NotFound`.
    2. Mach aus den drei Einträgen der Navigation `<NavLink>`s, damit der aktuelle die Klasse `active` bekommt.
  checks:
    home: Auf `/` steht **Welcome**
    links-navigate: Die Links wechseln URL und Seite
    active-link: Nur der aktuelle Link ist aktiv
    not-found: Unbekannte Pfade zeigen **Page not found**
---

# Routen und Links

Eine React-App ist eine einzige HTML-Seite. Damit es trotzdem mehrere „Seiten“ mit eigenen URLs gibt – `/`, `/about`, `/products/42` –, brauchst du einen **Router**. Der verbreitetste ist **React Router**.

## Installieren

```bash
npm install react-router
```

> [!NOTE]
> In älteren Anleitungen steht `react-router-dom`. Seit Version 8 gibt es dieses Paket nicht mehr – alles kommt aus `react-router`.

## Routen festlegen

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

- **`BrowserRouter`** verbindet React Router mit der Adresszeile des Browsers. Er gehört einmal ganz nach außen.
- **`Routes`** wählt die Route aus, die zur aktuellen URL passt, und zeigt ihr `element`.
- **`path="*"`** passt auf alles, wofür es keine andere Route gibt – die 404-Seite.

Die Reihenfolge der Routen spielt keine Rolle: React Router wählt immer die spezifischste.

## Links

```tsx
import { Link, NavLink } from 'react-router';

<Link to="/about">Über uns</Link>
```

Ein `Link` rendert ein normales `<a>`, wechselt die Seite aber **ohne Neuladen**: React tauscht nur die Route aus, State und geladene Daten bleiben erhalten. Mit `<a href>` würde die ganze App neu starten.

**`NavLink`** ist ein Link, der weiß, ob er zur aktuellen Seite führt. Dann bekommt er die Klasse `active` und `aria-current="page"` – ideal für Navigationen:

```tsx
<nav>
  <NavLink to="/">Start</NavLink>
  <NavLink to="/about">Über uns</NavLink>
</nav>
```

```css
nav a.active {
  font-weight: bold;
}
```

## Weiterleiten

```tsx
<Route path="/home" element={<Navigate to="/" replace />} />
```

`replace` ersetzt den aktuellen Eintrag in der Browser-Historie, sodass „Zurück“ nicht wieder auf der Weiterleitung landet.

> [!WARNING]
> Ruft jemand `/about` direkt auf (oder lädt neu), fragt der Browser den Server nach dieser Adresse. Der Server muss dann die `index.html` ausliefern, sonst gibt es einen 404. Bei Netlify erledigt das eine Regel `/* /index.html 200`, Vite macht es im Dev-Server automatisch.

::tryit{routes-basics}
