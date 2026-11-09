import { data, type LoaderFunctionArgs, type RouteObject } from 'react-router';
import { getNote, getNotes } from './api';
import ErrorPage from './ErrorPage';
import Layout from './Layout';
import NewNotePage from './NewNotePage';
import NotePage from './NotePage';
import NotesPage from './NotesPage';

export async function notesLoader() {
  return getNotes();
}

export async function noteLoader({ params }: LoaderFunctionArgs) {
  const note = await getNote(Number(params.id));
  if (!note) throw data('Note not found', { status: 404 });
  return note;
}

// The route tree – App.tsx turns it into a browser router, tests into a memory router.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, loader: notesLoader, element: <NotesPage /> },
      { path: 'notes/new', element: <NewNotePage /> },
      { path: 'notes/:id', loader: noteLoader, element: <NotePage />, errorElement: <ErrorPage /> },
    ],
  },
];
