import { createBrowserRouter, Link, Outlet } from 'react-router';
import { RouterProvider } from 'react-router/dom';

function Root() {
  return (
    <>
      <h1>Recipes</h1>
      <nav>
        <Link to="/recipes/1">Pancakes</Link> <Link to="/recipes/2">Risotto</Link> <Link to="/recipes/7">Missing</Link>
      </nav>
      <Outlet />
    </>
  );
}

// TODO 1: write a loader for "recipes/:id" that calls getRecipe(Number(params.id)).
//         If there is no recipe, throw data('Recipe not found', { status: 404 }).
// TODO 2: RecipePage reads the recipe with useLoaderData() and shows
//         <h2 id="title">{title}</h2> and <p id="minutes">{minutes} min</p>
// TODO 3: add an errorElement for the route that shows <p id="error">{error.data}</p> (useRouteError)
function RecipePage() {
  return <h2 id="title">?</h2>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [{ path: 'recipes/:id', element: <RecipePage /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
