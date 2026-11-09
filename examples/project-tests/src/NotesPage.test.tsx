import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { describe, expect, it } from 'vitest';
import type { Note } from './api';
import NotePage from './NotePage';
import NotesPage from './NotesPage';

const notes: Note[] = [
  { id: 1, title: 'Groceries', body: 'Milk, eggs', pinned: false },
  { id: 2, title: 'Dentist', body: 'Monday morning', pinned: true },
  { id: 3, title: 'Ideas', body: 'A notes app with milk delivery', pinned: false },
];

// A memory router with stub loaders: no fetch, no fake server – the test decides the data.
function renderNotes() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <NotesPage />, loader: () => notes },
      { path: '/notes/:id', element: <NotePage />, loader: ({ params }) => notes.find((n) => n.id === Number(params.id)) },
    ],
    { initialEntries: ['/'] },
  );
  render(<RouterProvider router={router} />);
}

describe('NotesPage', () => {
  it('lists pinned notes first', async () => {
    renderNotes();

    // findBy… waits until the loader has finished
    const links = await screen.findAllByRole('link');
    expect(links.map((l) => l.textContent)).toEqual(['Dentist', 'Groceries', 'Ideas']);
  });

  it('filters by title and text', async () => {
    const user = userEvent.setup();
    renderNotes();

    await user.type(await screen.findByLabelText('Search'), 'milk');

    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.queryByRole('link', { name: 'Dentist' })).toBeNull();
    expect(screen.getByText('2 of 3 notes')).toBeInTheDocument();
  });

  it('opens a note', async () => {
    const user = userEvent.setup();
    renderNotes();

    await user.click(await screen.findByRole('link', { name: 'Groceries' }));

    expect(await screen.findByRole('heading', { name: 'Groceries' })).toBeInTheDocument();
    expect(screen.getByText('Milk, eggs')).toBeInTheDocument();
  });
});
