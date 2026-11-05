---
title: Vitest and Testing Library
minutes: 9
summary: |-
  - Vitest is the test runner; React Testing Library renders components and queries them. `environment: 'jsdom'` provides a simulated DOM, `@testing-library/jest-dom/vitest` adds matchers like `toBeInTheDocument()`.
  - `describe` groups tests, `it` is a single test, `render` renders, `screen` queries the page, `expect` checks. `npx vitest` runs all `.test.tsx` files in watch mode.
  - Test behavior like a user: prefer `getByRole` with a name, then `getByLabelText`, `getByText` – `getByTestId` only as a last resort.
  - `getBy…` throws if nothing is found. `queryBy…` returns `null` (to check that something is absent). `findBy…` waits via a promise.
  - For multiple matches there are `getAllBy…`, `queryAllBy…` and `findAllBy…`.

  ```tsx
  describe('Greeting', () => {
    it('greets the user by name', () => {
      render(<Greeting name="Ada" />);
      expect(screen.getByRole('heading', { name: 'Hello, Ada!' })).toBeInTheDocument();
    });
  });
  ```

  > [!TIP] If `getByRole` can't find your button, it's probably poorly accessible to screen readers too.
quiz:
  - question: "Which query should you prefer to find a button?"
    options: ["`container.querySelector('.btn')`","`document.getElementsByTagName('button')[0]`","`screen.getByTestId('save')`","`screen.getByRole('button', { name: 'Save' })`"]
    answer: 3
    explanation: "Roles and visible names are what users and screen readers perceive. Test IDs are the last resort."
  - question: "What is the difference between `getByText` and `queryByText`?"
    options: ["`getBy…` throws an error if nothing is found, `queryBy…` returns `null`","There is none","`queryBy…` waits until the element appears","`queryBy…` finds multiple elements"]
    answer: 0
  - question: "What does Testing Library test: implementation or behavior?"
    options: ["The implementation: state, props, internal functions", "The behavior: what is on the screen and how you interact with it", "Only the CSS", "Only the performance"]
    answer: 1
exercise:
  example: ex-test-render
  title: Tests for a Badge
  task: |-
    In `UserBadge.test.tsx`, write tests using `render()` and `screen`:

    1. The badge shows the name and role it receives (e.g. **Grace** and **Admin**).
    2. Without a role, it shows **Member**.

    The preview runs your tests and shows the result. The checks also run them against deliberately broken versions of the badge – good tests catch every one of them.
  checks:
    tests-pass: At least two tests, all green
    catches-name: A badge that always shows “Ada” is caught
    catches-role: A badge that ignores the role is caught
    catches-default: A badge without a default role is caught
---

# Vitest and Testing Library

Tests give you the confidence to change code without accidentally breaking something. For React components, the most common combination is **Vitest** (the test runner, a perfect fit for Vite) and **React Testing Library** (render and query components).

## Setup

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // a simulated DOM in Node
    setupFiles: ['./src/setupTests.ts'],
  },
});
```

```ts
// src/setupTests.ts – matchers like toBeInTheDocument()
import '@testing-library/jest-dom/vitest';
```

`npx vitest` runs all files ending in `.test.tsx` – in watch mode, it reruns them on every change.

> [!NOTE]
> In this course's examples, the tests run right in the preview, in a small Vitest-compatible runner. You write them exactly as you would in a real project.

## Your First Test

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Greeting from './Greeting';

describe('Greeting', () => {
  it('greets the user by name', () => {
    render(<Greeting name="Ada" />);
    expect(screen.getByRole('heading', { name: 'Hello, Ada!' })).toBeInTheDocument();
  });
});
```

- **`describe`** groups tests, **`it`** (or `test`) is a single test.
- **`render`** renders the component into a real or simulated DOM.
- **`screen`** queries the whole page, **`expect`** checks the result.

## Query Like a User

Testing Library follows a clear idea: test what users see and do – not how the component is built internally. That's why you query elements the way a person would find them. In this order:

| Query | Finds … |
|---|---|
| `getByRole('button', { name: 'Save' })` | elements by role and accessible name – the first choice |
| `getByLabelText('Email')` | form fields by their label |
| `getByText('No results')` | visible text |
| `getByTestId('chart')` | by `data-testid` – only when nothing else works |

A nice side effect: if `getByRole` can't find your button, it's probably poorly accessible to screen readers too.

## getBy, queryBy, findBy

| Variant | If nothing is found | Use for |
|---|---|---|
| `getBy…` | throws an error | elements that must be there |
| `queryBy…` | returns `null` | checking that something is **not** there |
| `findBy…` | waits (Promise) | elements that appear later |

```tsx
expect(screen.queryByText(/error/i)).toBeNull();
expect(await screen.findByText('Saved')).toBeInTheDocument();
```

For multiple matches, there are `getAllBy…`, `queryAllBy…` and `findAllBy…`.

::tryit{test-basics}
