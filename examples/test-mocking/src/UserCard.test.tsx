import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import UserCard from './UserCard';

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });

describe('UserCard', () => {
  it('loads and shows the user', async () => {
    // Replace fetch for this test – no real server needed
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({ id: 7, name: 'Grace Hopper' }));

    render(<UserCard userId={7} onFollow={() => {}} />);

    expect(await screen.findByRole('heading', { name: 'Grace Hopper' })).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith('/api/users/7');
  });

  it('shows an error when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({}, 500));

    render(<UserCard userId={1} onFollow={() => {}} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 500');
  });

  it('calls onFollow with the user id', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(json({ id: 7, name: 'Grace Hopper' }));
    const onFollow = vi.fn();
    const user = userEvent.setup();

    render(<UserCard userId={7} onFollow={onFollow} />);
    await user.click(await screen.findByRole('button', { name: 'Follow' }));

    expect(onFollow).toHaveBeenCalledTimes(1);
    expect(onFollow).toHaveBeenCalledWith(7);
  });
});
