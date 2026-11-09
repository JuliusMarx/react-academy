import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { NoteDraft } from './api';
import NoteForm from './NoteForm';

describe('NoteForm', () => {
  it('rejects a short title', async () => {
    const onSave = vi.fn(async (_draft: NoteDraft) => {});
    const user = userEvent.setup();
    render(<NoteForm onSave={onSave} />);

    await user.type(screen.getByLabelText('Title'), 'Hi');
    await user.click(screen.getByRole('button', { name: 'Save note' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('at least 3 characters');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves title and text', async () => {
    const onSave = vi.fn(async (_draft: NoteDraft) => {});
    const user = userEvent.setup();
    render(<NoteForm onSave={onSave} />);

    await user.type(screen.getByLabelText('Title'), 'Groceries');
    await user.type(screen.getByLabelText('Text'), 'Milk, eggs');
    await user.click(screen.getByRole('button', { name: 'Save note' }));

    // The action runs asynchronously – waitFor retries until the assertion passes
    await waitFor(() => expect(onSave).toHaveBeenCalledWith({ title: 'Groceries', body: 'Milk, eggs' }));
  });
});
