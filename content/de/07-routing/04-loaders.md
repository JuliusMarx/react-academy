---
title: Daten mit Loadern
minutes: 9
summary: |-
  - Im **Data Mode** beschreibst du Routen als Objekte mit `createBrowserRouter([...])` und renderst `<RouterProvider router={router} />`. Den Router legst du einmal außerhalb von Komponenten an.
  - `RouterProvider` kommt aus `react-router/dom`, alles andere aus `react-router`.
  - Ein `loader` holt die Daten, **bevor** die Route rendert. Die Komponente liest sie mit `useLoaderData<typeof loader>()` – ohne Effekt und Ladezustand.
  - Während geladen wird, ist `useNavigation().state` gleich `'loading'`.
  - Wirft ein Loader, erscheint das `errorElement` (sonst das der nächsten Eltern-Route). `throw data('…', { status: 404 })` erzeugt eine Fehlerantwort, `useRouteError()` liest sie.

  ```tsx
  async function userLoader({ params }: LoaderFunctionArgs) {
    const user = await getUser(Number(params.id));
    if (!user) throw data('User not found', { status: 404 });
    return user;
  }

  function UserPage() {
    const user = useLoaderData<typeof userLoader>();
    return <h2>{user.name}</h2>;
  }

  { path: 'users/:id', loader: userLoader, element: <UserPage />, errorElement: <ErrorPage /> }
  ```

  > [!TIP] Für kleine Apps reicht `BrowserRouter` (Declarative Mode). Soll der Router auch Daten laden, nimm den Data Mode.
quiz:
  - question: "Wann läuft der `loader` einer Route?"
    options: ["Nachdem die Komponente gerendert hat, wie ein Effekt","Nur auf dem Server","Nur beim ersten Laden der App","Bevor die Route rendert – die Komponente bekommt die Daten sofort"]
    answer: 3
  - question: "Woher importierst du in React Router 8 `RouterProvider` für den Browser?"
    options: ["`react-router/dom`","`react-router`","`react-dom`","`react-router-dom`"]
    answer: 0
  - question: "Ein Loader findet den Datensatz nicht. Was tust du?"
    options: ["`window.alert` aufrufen","`null` zurückgeben und in der Komponente prüfen – oder `throw data('Not found', { status: 404 })`, damit das `errorElement` erscheint","Die Seite neu laden","Gar nichts"]
    answer: 1
exercise:
  example: ex-loader
  title: Rezepte mit Loader
  task: |-
    1. Schreibe einen `loader` für `recipes/:id`, der `getRecipe(Number(params.id))` aufruft. Gibt es kein Rezept, wirf `data('Recipe not found', { status: 404 })`.
    2. `RecipePage` liest das Rezept mit `useLoaderData()` und zeigt `<h2 id="title">` mit dem Titel und `<p id="minutes">` mit der Zeit (z. B. **40 min**).
    3. Gib der Route ein `errorElement`, das mit `useRouteError()` die Meldung in `<p id="error">` zeigt.
  checks:
    loads-recipe: Ein Klick auf **Risotto** zeigt Titel und Zeit
    direct-url: "`/recipes/1` direkt aufgerufen zeigt Pancakes"
    not-found: Ein unbekanntes Rezept zeigt **Recipe not found**
    uses-loader: "Geladen wird im Loader mit `useLoaderData()`, ohne `useEffect`"
---

# Daten mit Loadern

Bisher lädt jede Seite ihre Daten selbst, nachdem sie gerendert hat – mit Effekt, Ladezustand und allem. React Router kann das übernehmen: Im **Data Mode** bekommt jede Route einen **Loader**, der die Daten holt, *bevor* die Seite erscheint.

## Der Data Mode

Statt `<BrowserRouter>` und `<Routes>` beschreibst du die Routen als Objekte und erzeugst daraus einen Router:

```tsx
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <UserList />, loader: usersLoader },
      { path: 'users/:id', element: <UserPage />, loader: userLoader },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

`RouterProvider` kommt aus **`react-router/dom`**, alles andere aus `react-router`. Den Router legst du einmal außerhalb von Komponenten an.

## Loader und useLoaderData

Ein Loader ist eine (meist asynchrone) Funktion. Sie bekommt unter anderem die URL-Parameter und gibt die Daten zurück:

```tsx
import { useLoaderData, type LoaderFunctionArgs } from 'react-router';

async function userLoader({ params }: LoaderFunctionArgs) {
  const res = await fetch(`/api/users/${params.id}`);
  return res.json() as Promise<User>;
}

function UserPage() {
  const user = useLoaderData<typeof userLoader>();
  return <h2>{user.name}</h2>;
}
```

Klickt jemand auf einen Link, startet React Router den Loader und zeigt die neue Seite erst, wenn die Daten da sind. Die Komponente braucht keinen Ladezustand, keinen Effekt und keine Race-Condition-Behandlung – darum kümmert sich der Router. Mit `useLoaderData<typeof userLoader>()` kennt TypeScript sogar den Typ der Daten.

Während geladen wird, zeigt `useNavigation().state` den Wert `'loading'` – gut für einen globalen Ladehinweis.

## Fehler und errorElement

Wirft ein Loader, zeigt React Router statt der Seite das **`errorElement`** der Route:

```tsx
import { data, useRouteError, isRouteErrorResponse } from 'react-router';

async function userLoader({ params }: LoaderFunctionArgs) {
  const user = await getUser(Number(params.id));
  if (!user) throw data('User not found', { status: 404 });
  return user;
}

function ErrorPage() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) return <p>{error.status}: {error.data}</p>;
  return <p>Unerwarteter Fehler</p>;
}

{ path: 'users/:id', loader: userLoader, element: <UserPage />, errorElement: <ErrorPage /> }
```

Mit `data(…, { status })` erzeugst du eine Fehlerantwort mit Statuscode. Hat eine Route kein eigenes `errorElement`, übernimmt das der nächsten Eltern-Route.

## Actions und mehr

Im Data Mode gibt es noch mehr: **Actions** verarbeiten Formulare (`<Form method="post">`), danach lädt der Router die betroffenen Daten automatisch neu. Und im **Framework Mode** wird React Router zu einem vollständigen Framework mit dateibasierten Routen und Server-Rendering.

> [!TIP]
> Welcher Modus? Für eine kleine App reicht der **Declarative Mode** (`BrowserRouter`). Soll der Router auch Daten laden, nimm den **Data Mode**. Für neue, größere Projekte mit Server-Rendering lohnt sich der **Framework Mode** – oder ein Framework wie Next.js.

::tryit{data-router}
