import { createBrowserRouter, data, isRouteErrorResponse, Link, Outlet, useLoaderData, useNavigation, useRouteError } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { getUser, getUsers } from './api';

function Root() {
  const navigation = useNavigation();
  return (
    <>
      <h1>Users {navigation.state === 'loading' && <small>(loading …)</small>}</h1>
      <Outlet />
    </>
  );
}

function UserList() {
  const users = useLoaderData<typeof usersLoader>();
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          <Link to={`/users/${u.id}`}>{u.name}</Link>
        </li>
      ))}
      <li>
        <Link to="/users/99">A user who doesn't exist</Link>
      </li>
    </ul>
  );
}

function UserPage() {
  const user = useLoaderData<typeof userLoader>();
  return (
    <>
      <h2>{user.name}</h2>
      <Link to="/">Back</Link>
    </>
  );
}

function ErrorPage() {
  const error = useRouteError();
  return (
    <p role="alert">
      {isRouteErrorResponse(error) ? `${error.status} – ${error.data}` : 'Unexpected error'} <Link to="/">Back</Link>
    </p>
  );
}

async function usersLoader() {
  return getUsers();
}

async function userLoader({ params }: { params: { id?: string } }) {
  const user = await getUser(Number(params.id));
  if (!user) throw data('User not found', { status: 404 });
  return user;
}

// The loader runs before the route renders – the component gets the data right away.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, loader: usersLoader, element: <UserList /> },
      { path: 'users/:id', loader: userLoader, element: <UserPage />, errorElement: <ErrorPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
