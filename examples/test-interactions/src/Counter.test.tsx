import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Counter from './Counter';

describe('Counter', () => {
  it('counts clicks', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(screen.getByLabelText('count')).toHaveTextContent('2');
  });

  it('takes a typed value', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.type(screen.getByLabelText('Set to'), '42');

    expect(screen.getByLabelText('count')).toHaveTextContent('42');
  });

  it('confirms saving – after a short wait', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    // findBy… waits (up to 1 s) until the element appears
    expect(await screen.findByText('Saved!')).toBeInTheDocument();
  });
});
