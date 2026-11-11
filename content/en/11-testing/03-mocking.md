---
title: Mocks
minutes: 8
summary: |-
  - Mocks replace dependencies you don't want for real in a test and record how they were called.
  - For callback props, pass `vi.fn()` and check with `toHaveBeenCalledTimes(n)`, `toHaveBeenCalledWith(…)` or `not.toHaveBeenCalled()`.
  - `mockReturnValue(42)` or `mockResolvedValue(data)` sets what the mock returns.
  - `vi.spyOn(globalThis, 'fetch')` simulates server responses without a server. With `new Response('{}', { status: 500 })` you test the error case.
  - Restore the originals after each test: `vi.restoreAllMocks()` in `afterEach` or `restoreMocks: true` in the config.
  - `vi.mock('./api')` replaces whole modules; MSW intercepts requests at the network level.

  ```tsx
  it('loads the user', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ id: 7, name: 'Grace Hopper' })));

    render(<UserCard userId={7} />);

    expect(await screen.findByRole('heading', { name: 'Grace Hopper' })).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith('/api/users/7');
  });
  ```

  > [!WARNING] Mock as little as possible – every mock is an assumption, and too many make your tests verify those assumptions instead of the real interplay.
quiz:
  - question: "How do you check that a component calls its callback prop `onSave` with the right data?"
    options: ["With `console.log`","With a real server","You can't","With `const onSave = vi.fn()` and `expect(onSave).toHaveBeenCalledWith(…)`"]
    answer: 3
  - question: "How do you replace `fetch` in a test?"
    options: ["With `vi.spyOn(globalThis, 'fetch').mockResolvedValue(…)`", "By turning off the network", "With `window.fetch = undefined`", "You can't, tests need a server"]
    answer: 0
  - question: "What is a downside of too many mocks?"
    options: ["Tests get slower", "The tests end up verifying your assumptions rather than how things really work together", "Mocks don't work with React", "There is none"]
    answer: 1
exercise:
  example: ex-test-mocks
  title: Testing a Form with a Mock
  task: |-
    Test `SubscribeForm` with a mock function (`const onSubscribe = vi.fn()`):

    1. With a valid email, **Subscribe** calls `onSubscribe` exactly once – with exactly that email.
    2. With an invalid email (without **@**), the error message appears and `onSubscribe` is **not** called.
  checks:
    tests-pass: At least two tests, all green
    catches-argument: A form that passes a different email is caught
    catches-invalid: A form that lets invalid emails through is caught
---

# Mocks

Many components depend on something you don't want to be real in a test: a callback prop from the parent component, a server, the current time. For these, you substitute **mocks** – stand-ins that record how they were called.

## Mock functions with vi.fn

For callback props, you pass a mock function and then check how it was called:

```tsx
import { vi } from 'vitest';

it('reports the subscription', async () => {
  const onSubscribe = vi.fn();
  const user = userEvent.setup();
  render(<SubscribeForm onSubscribe={onSubscribe} />);

  await user.type(screen.getByLabelText('Email'), 'ada@example.com');
  await user.click(screen.getByRole('button', { name: 'Subscribe' }));

  expect(onSubscribe).toHaveBeenCalledTimes(1);
  expect(onSubscribe).toHaveBeenCalledWith('ada@example.com');
});
```

| Matcher | Checks |
|---|---|
| `toHaveBeenCalled()` | was called at least once |
| `toHaveBeenCalledTimes(n)` | exactly `n` times |
| `toHaveBeenCalledWith(...args)` | with these arguments |
| `not.toHaveBeenCalled()` | not at all |

With `vi.fn().mockReturnValue(42)` or `.mockResolvedValue(data)`, you define what the mock returns.

## Replacing fetch with vi.spyOn

`vi.spyOn(object, 'method')` replaces an existing function with a mock. This lets you simulate server responses without a server:

```tsx
it('loads the user', async () => {
  const fetchSpy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({ id: 7, name: 'Grace Hopper' })));

  render(<UserCard userId={7} />);

  expect(await screen.findByRole('heading', { name: 'Grace Hopper' })).toBeInTheDocument();
  expect(fetchSpy).toHaveBeenCalledWith('/api/users/7');
});
```

With a response like `new Response('{}', { status: 500 })`, you can test the error case too. After each test, restore the original – with `vi.restoreAllMocks()` in `afterEach` or the `restoreMocks: true` option in the Vitest config.

## Replacing whole modules

In real Vitest projects, you can replace an entire module with mocks using `vi.mock('./api')`. For network requests, **MSW** (Mock Service Worker) is popular: it intercepts requests at the network level, so your code runs exactly as it does in production.

> [!WARNING]
> Mock as little as possible. Every mock is an assumption about how the real dependency behaves. The more you mock, the more your tests verify those assumptions instead of how things really work together.

::tryit{test-mocking}
