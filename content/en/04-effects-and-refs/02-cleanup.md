---
title: Cleanup
minutes: 8
quiz:
  - question: "When does React call an Effect's cleanup function?"
    options: ["Only when the page is reloaded", "Before the Effect runs again and when the component is removed", "After every click", "Never automatically"]
    answer: 1
  - question: "Why does an Effect run twice in development mode?"
    options: ["A bug in Vite", "StrictMode mounts, unmounts, and remounts the component to reveal missing cleanup", "Because the dependency array is missing", "It also happens in the production build"]
    answer: 1
exercise:
  example: ex-timer
  title: A Stopwatch
  task: |-
    1. While `running` is true, a `setInterval` increases `seconds` by 1 every second.
    2. Return a cleanup function that clears the interval – otherwise the clock keeps running after **Stop**.

    Hint: With `setSeconds((s) => s + 1)`, `seconds` doesn't need to be a dependency.
  checks:
    counts: After **Start**, the clock counts once per second
    stops: After **Stop**, it stands still
    resets: "**Reset** sets it back to 0"
---

# Cleanup

Many Effects start something that keeps running: a timer, an event listener, a connection. It has to be stopped again when it is no longer needed. For that, the Effect returns a **cleanup function**.

## The Cleanup Function

```tsx
useEffect(() => {
  const id = setInterval(() => setTime(new Date()), 1000);
  return () => clearInterval(id);
}, []);
```

React calls the cleanup function

- **before the Effect runs again**, because a dependency has changed, and
- **when the component is removed** (unmount).

That way every "start" is matched by exactly one "stop".

## Typical Pairs

| In the Effect | In the cleanup function |
|---|---|
| `setInterval` / `setTimeout` | `clearInterval` / `clearTimeout` |
| `addEventListener` | `removeEventListener` |
| Open a connection | Close the connection |
| Subscribe | Unsubscribe |

```tsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);
```

## Dependencies and Cleanup

When a dependency changes, React first cleans up with the **old** values and then starts the Effect with the **new** ones:

```tsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();
  return () => connection.disconnect(); // disconnects the old room
}, [roomId]);
```

## StrictMode: Effects Run Twice

In development mode, `StrictMode` unmounts and remounts every component once after its first render: Effect → cleanup → Effect. If cleanup is missing, this makes it obvious right away – for example, because a timer runs twice as fast.

> [!NOTE]
> This is not a bug you should work around (for instance with an "already started" variable). Instead, make sure the cleanup function cleanly reverses the Effect. In the production build, the Effect runs only once.

::tryit{effect-cleanup}
