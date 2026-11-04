import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Greeting from './Greeting';

describe('Greeting', () => {
  it('greets the user by name', () => {
    render(<Greeting name="Ada" />);
    // Query like a user would: by role and accessible name
    expect(screen.getByRole('heading', { name: 'Hello, Ada!' })).toBeInTheDocument();
  });

  it('shows the number of unread messages', () => {
    render(<Greeting name="Ada" unread={3} />);
    expect(screen.getByText('You have 3 new messages.')).toBeInTheDocument();
  });

  it('says so when there are no messages', () => {
    render(<Greeting name="Ada" />);
    expect(screen.getByText(/no new messages/i)).toBeInTheDocument();
    // queryBy… returns null instead of throwing – good for "is not there"
    expect(screen.queryByText(/you have/i)).toBeNull();
  });

  it('has a button to open the inbox', () => {
    render(<Greeting name="Ada" />);
    expect(screen.getByRole('button', { name: 'Open inbox' })).toBeEnabled();
  });
});
