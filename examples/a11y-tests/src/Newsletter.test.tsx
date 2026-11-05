import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import Newsletter from './Newsletter';

/** Runs axe (WCAG A and AA rules) on the rendered markup and returns the ids of the violated rules. */
async function violations(container: HTMLElement) {
  const results = await axe.run(container, { runOnly: ['wcag2a', 'wcag2aa'] });
  return results.violations.map((v) => v.id);
}

describe('Newsletter', () => {
  it('can be found by role and name', () => {
    render(<Newsletter />);
    expect(screen.getByRole('form', { name: 'Newsletter' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Newsletter' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('announces the result in a status region', async () => {
    const user = userEvent.setup();
    render(<Newsletter />);

    // The region exists before anything happens – otherwise screen readers might miss the update
    expect(screen.getByRole('status').textContent).toBe('');

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(screen.getByRole('status')).toHaveTextContent('Thanks! We sent a confirmation to ada@example.com.');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Newsletter />);
    expect(await violations(container)).toEqual([]);
  });

  it('axe finds a button without a name', async () => {
    // An icon-only button: nothing a screen reader could read out
    const { container } = render(
      <button>
        <svg aria-hidden="true" width="16" height="16" />
      </button>,
    );
    expect(await violations(container)).toContain('button-name');
  });
});
