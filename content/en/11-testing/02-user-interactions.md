---
title: Testing User Interactions
minutes: 8
quiz:
  - question: "Why use `userEvent` instead of `fireEvent`?"
    options: ["`fireEvent` no longer exists", "`userEvent` simulates a real interaction with all its events (focus, key presses, click) – `fireEvent` only fires a single event", "`userEvent` is synchronous", "There is no difference"]
    answer: 1
  - question: "What do you need to keep in mind with `user.click(…)`?"
    options: ["Nothing","It only works with `<a>`","It returns a Promise – you have to wait for it with `await`","You have to call `act()` first"]
    answer: 2
  - question: "A text only appears after an asynchronous save. How do you wait for it?"
    options: ["`setTimeout` in the test","You can't, it isn't testable","`getByText` is enough","`await screen.findByText('Saved')`"]
    answer: 3
exercise:
  example: ex-test-events
  title: Testing a Counter
  task: |-
    Test `Counter` with `userEvent` (`const user = userEvent.setup(); await user.click(…)`):

    1. **Increment** increases by 1.
    2. **Decrement** decreases by 1 – but never below 0.
    3. **Reset** sets it back to 0.

    You read the value with `screen.getByLabelText('count')`.
  checks:
    tests-pass: At least three tests, all green
    catches-step: A counter that increments by 2 is caught
    catches-negative: A counter that goes below 0 is caught
    catches-reset: A reset that does nothing is caught
---

# Testing User Interactions

Most bugs hide in interactions: clicks, input, forms. With **`@testing-library/user-event`**, you simulate them the way a person would perform them.

## userEvent

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('counts clicks', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole('button', { name: 'Increment' }));

  expect(screen.getByLabelText('count')).toHaveTextContent('1');
});
```

- **`userEvent.setup()`** creates a “user” – best called at the start of each test.
- All actions are **asynchronous**. Don't forget the `await`, or you'll assert before the action has finished.
- Like in the browser, a click fires all the events: pointer, focus, `mousedown`, `mouseup`, `click`.

## The Most Important Actions

| Action | Simulates |
|---|---|
| `await user.click(element)` | a click |
| `await user.type(input, 'Hello')` | typing, character by character |
| `await user.clear(input)` | clearing a field |
| `await user.selectOptions(select, 'pro')` | choosing an option in a `<select>` |
| `await user.keyboard('{Enter}')` | key presses |
| `await user.tab()` | moving to the next element with Tab |

`fireEvent` from Testing Library, by contrast, fires only a single event. It's faster but less realistic – only use it when `userEvent` can't do something.

## Waiting for Changes

If something only appears after an asynchronous action, use **`findBy…`**. It waits for up to one second:

```tsx
await user.click(screen.getByRole('button', { name: 'Save' }));
expect(await screen.findByText('Saved!')).toBeInTheDocument();
```

For everything else, there's **`waitFor`**, which retries an assertion until it passes:

```tsx
await waitFor(() => expect(onSave).toHaveBeenCalled());
```

> [!TIP]
> Test **behavior**, not intermediate steps: “After clicking Save, ‘Saved’ is shown” is a good test. “The function `setSaved` was called” tests the implementation – and breaks on the next refactor even though everything still works.

::tryit{test-interactions}
