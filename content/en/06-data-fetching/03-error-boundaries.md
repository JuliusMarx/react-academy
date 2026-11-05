---
title: Error Boundaries
minutes: 7
summary: |-
  - Without an Error Boundary, an error during rendering removes the **entire** app from the screen.
  - An Error Boundary catches errors from its children and shows a fallback – only for its part of the page.
  - It's the one case where you still need a **class component**: `getDerivedStateFromError` sets the state, `componentDidCatch` logs.
  - Resetting `error` to `null` renders the children again – handy for a "Try again" button.
  - Together with `<Suspense>` you cover both **still loading** and **failed**.
  - Not caught: errors in event handlers, in asynchronous code, and in the boundary itself.

  ```tsx
  class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
      return { error };
    }

    render() {
      if (this.state.error) return <p role="alert">Something went wrong.</p>;
      return this.props.children;
    }
  }
  ```

  > [!TIP] The `react-error-boundary` package offers a ready-made boundary, a reset function, and `useErrorBoundary`.
quiz:
  - question: "Which errors does an error boundary catch?"
    options: ["All errors on the page","Errors in `setTimeout`","Errors in event handlers","Errors while rendering its children (including from `use()`)"]
    answer: 3
    explanation: "You catch errors in event handlers and asynchronous code with `try/catch` and display them through state."
  - question: "How do you write an error boundary?"
    options: ["As a class component with `static getDerivedStateFromError`","As a function component with `useError`","With `try/catch` around the JSX","With `<Suspense>`"]
    answer: 0
exercise:
  example: ex-error-boundary
  title: Catching a Crash
  task: |-
    The counter crashes as soon as it reaches 3 – and takes the whole app down with it.

    1. In `ErrorBoundary`, add the method `static getDerivedStateFromError(error)` that returns `{ error }`.
    2. If there is an error, show `<div role="alert">` with **Something went wrong:** and the message, plus a button **Try again**.
    3. **Try again** resets the error so the children are shown again.
  checks:
    shows-fallback: After the crash, the error message appears
    rest-survives: The rest of the page stays visible
    try-again: "**Try again** shows the counter again"
---

# Error Boundaries

When a component throws an error while rendering, React normally removes the **entire** app from the screen. An **error boundary** catches the error and shows a fallback instead – only for its part of the page.

## Writing an Error Boundary

Error boundaries are the one case where you still need a **class component**:

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error }; // the next render shows the fallback
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logToService(error, info.componentStack); // e.g. report to a monitoring service
  }

  render() {
    if (this.state.error) return <p role="alert">Something went wrong.</p>;
    return this.props.children;
  }
}
```

- `getDerivedStateFromError` sets the state after an error.
- `componentDidCatch` is the place for logging.
- If you set `error` back to `null`, the boundary renders its children again – handy for a 'Try again' button.

## Using It

```tsx
<ErrorBoundary>
  <Suspense fallback={<Spinner />}>
    <Comments />
  </Suspense>
</ErrorBoundary>
```

Place boundaries where a failure should be contained: around a widget, a page, a section. Together with Suspense, you cover both cases: **still loading** and **failed**.

## What Error Boundaries Don't Catch

- Errors in **event handlers** – use `try/catch` plus state here.
- **Asynchronous** code like `setTimeout` or a `fetch` whose error you don't pass on to React.
- Errors in the boundary itself.

> [!TIP]
> Instead of writing the class yourself, many projects use the **react-error-boundary** package. It offers `<ErrorBoundary FallbackComponent={…}>`, a reset function, and the `useErrorBoundary` hook, which lets you pass errors from event handlers to the boundary as well.

::tryit{error-boundary}
