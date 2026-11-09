import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export default function ErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} – ${error.data}`
    : error instanceof Error
      ? error.message
      : 'Unexpected error';
  return (
    <div role="alert">
      <p>{message}</p>
      <Link to="/">Back to all notes</Link>
    </div>
  );
}
