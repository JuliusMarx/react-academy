import { createBrowserRouter, data, Link, Outlet, useLoaderData, useRouteError, type LoaderFunctionArgs } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { getRecipe } from './api';

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

async function recipeLoader({ params }: LoaderFunctionArgs) {
  const recipe = await getRecipe(Number(params.id));
  if (!recipe) throw data('Recipe not found', { status: 404 });
  return recipe;
}

function RecipePage() {
  const recipe = useLoaderData<typeof recipeLoader>();
  return (
    <>
      <h2 id="title">{recipe.title}</h2>
      <p id="minutes">{recipe.minutes} min</p>
    </>
  );
}

function RecipeError() {
  const error = useRouteError() as { data?: string };
  return <p id="error">{error.data ?? 'Something went wrong'}</p>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [{ path: 'recipes/:id', loader: recipeLoader, element: <RecipePage />, errorElement: <RecipeError /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
