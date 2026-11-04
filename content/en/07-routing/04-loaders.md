---
title: Data with Loaders
minutes: 9
quiz:
  - question: "When does a route's `loader` run?"
    options: ["After the component has rendered, like an effect","Only on the server","Only on the first load of the app","Before the route renders – the component gets the data immediately"]
    answer: 3
  - question: "In React Router 8, where do you import `RouterProvider` from for the browser?"
    options: ["`react-router/dom`","`react-router`","`react-dom`","`react-router-dom`"]
    answer: 0
  - question: "A loader can't find the record. What do you do?"
    options: ["Call `window.alert`","Return `null` and check it in the component – or `throw data('Not found', { status: 404 })` so the `errorElement` appears","Reload the page","Nothing"]
    answer: 1
exercise:
  example: ex-loader
  title: Recipes with a loader
  task: |-
    1. Write a `loader` for `recipes/:id` that calls `getRecipe(Number(params.id))`. If there is no recipe, throw `data('Recipe not found', { status: 404 })`.
    2. `RecipePage` reads the recipe with `useLoaderData()` and shows `<h2 id="title">` with the title and `<p id="minutes">` with the time (e.g. **40 min**).
    3. Give the route an `errorElement` that shows the message in `<p id="error">` using `useRouteError()`.
  checks:
    loads-recipe: Clicking **Risotto** shows the title and time
    direct-url: "Opening `/recipes/1` directly shows Pancakes"
    not-found: An unknown recipe shows **Recipe not found**
    uses-loader: "Data is loaded in the loader and read with `useLoaderData()`, without `useEffect`"
---

# Data with Loaders

So far, each page loads its own data after it has rendered – with an effect, a loading state and everything. React Router can take that over: in **Data Mode**, each route gets a **loader** that fetches the data *before* the page appears.

## Data Mode

Instead of `<BrowserRouter>` and `<Routes>`, you describe the routes as objects and create a router from them:

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

`RouterProvider` comes from **`react-router/dom`**, everything else from `react-router`. You create the router once, outside of components.

## Loaders and useLoaderData

A loader is a (usually asynchronous) function. Among other things, it receives the URL params and returns the data:

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

When someone clicks a link, React Router starts the loader and only shows the new page once the data is there. The component needs no loading state, no effect and no race-condition handling – the router takes care of that. With `useLoaderData<typeof userLoader>()`, TypeScript even knows the type of the data.

While loading, `useNavigation().state` has the value `'loading'` – good for a global loading indicator.

## Errors and errorElement

If a loader throws, React Router shows the route's **`errorElement`** instead of the page:

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
  return <p>Unexpected error</p>;
}

{ path: 'users/:id', loader: userLoader, element: <UserPage />, errorElement: <ErrorPage /> }
```

With `data(…, { status })`, you create an error response with a status code. If a route has no `errorElement` of its own, the nearest parent route's takes over.

## Actions and more

Data Mode offers more: **actions** handle forms (`<Form method="post">`), after which the router automatically reloads the affected data. And in **Framework Mode**, React Router becomes a full framework with file-based routes and server rendering.

> [!TIP]
> Which mode? For a small app, **Declarative Mode** (`BrowserRouter`) is enough. If the router should also load data, use **Data Mode**. For new, larger projects with server rendering, **Framework Mode** is worth it – or a framework like Next.js.

::tryit{data-router}
