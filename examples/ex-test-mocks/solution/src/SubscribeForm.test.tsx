import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SubscribeForm from './SubscribeForm';

describe('SubscribeForm', () => {
  it('subscribes with the typed email', async () => {
    const onSubscribe = vi.fn();
    const user = userEvent.setup();
    render(<SubscribeForm onSubscribe={onSubscribe} />);

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(onSubscribe).toHaveBeenCalledTimes(1);
    expect(onSubscribe).toHaveBeenCalledWith('ada@example.com');
  });

  it('rejects an invalid email', async () => {
    const onSubscribe = vi.fn();
    const user = userEvent.setup();
    render(<SubscribeForm onSubscribe={onSubscribe} />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email');
    expect(onSubscribe).not.toHaveBeenCalled();
  });
});
