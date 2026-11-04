import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UserBadge from './UserBadge';

describe('UserBadge', () => {
  it('shows the name and the role', () => {
    render(<UserBadge name="Grace" role="Admin" />);
    expect(screen.getByText('Grace')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows "Member" without a role', () => {
    render(<UserBadge name="Linus" />);
    expect(screen.getByText('Member')).toBeInTheDocument();
  });
});
