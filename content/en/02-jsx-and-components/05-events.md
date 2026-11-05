---
title: Events
minutes: 7
summary: |-
  - You respond to user actions with event handlers, passed as props like `onClick`, `onChange`, or `onSubmit`.
  - Pass the function itself: `onClick={handleClick}`. For arguments, use an arrow function: `onClick={() => remove(item.id)}`.
  - Naming convention: handlers are called `handle` + event, the props `on` + event.
  - Every handler receives an event object. `e.preventDefault()`, for example, stops a form from reloading the page.
  - Events bubble up the tree. `e.stopPropagation()` stops that.
  - Your own components can accept handlers as props – that way the parent decides what happens.

  ```tsx
  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get('city'));
  }

  <form onSubmit={handleSubmit}>
    <input name="city" />
    <button type="submit">Send</button>
  </form>
  ```

  > [!WARNING] `onClick={handleClick()}` calls the function immediately during rendering, not on click.
quiz:
  - question: "Which notation calls `handleClick` only when the click happens?"
    options: ["`onClick={handleClick()}`","`onclick=\"handleClick\"`","`onClick={handleClick}`","`onClick=\"handleClick()\"`"]
    answer: 2
    explanation: "With parentheses, the function is called immediately during rendering. You pass the function itself, or an arrow function: `onClick={() => remove(id)}`."
  - question: "How do you prevent a form from reloading the page on submit?"
    options: ["`return false` in the handler","You can't","`e.stopPropagation()`","`e.preventDefault()`"]
    answer: 3
---

# Events

You respond to user actions with **event handlers**: functions you pass as a prop such as `onClick`, `onChange` or `onSubmit`.

## Passing handlers

```tsx
function Toolbar() {
  function handleClick() {
    alert('Saved!');
  }

  return (
    <>
      <button onClick={handleClick}>Save</button>
      <button onClick={() => alert('Deleted!')}>Delete</button>
    </>
  );
}
```

> [!WARNING]
> Pass the function, don't call it: `onClick={handleClick}` instead of `onClick={handleClick()}`. With parentheses, it runs immediately during rendering. If you need arguments, use an arrow function: `onClick={() => remove(item.id)}`.

Handlers are usually named `handle` + event (`handleClick`, `handleSubmit`), and the matching props `on` + event.

## The event object

Every handler receives an event object. React passes through the familiar properties and methods:

```tsx
import type { SubmitEvent } from 'react';

function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
  e.preventDefault(); // no page reload
  const data = new FormData(e.currentTarget);
  console.log(data.get('city'));
}

<form onSubmit={handleSubmit}>
  <input name="city" />
  <button type="submit">Submit</button>
</form>
```

## Bubbling

Events travel up the tree: a click on a button also triggers `onClick` on the surrounding elements. You stop this with `e.stopPropagation()`.

## Handlers as props

Your own components can pass handlers along. This way the parent component decides what happens on a click:

```tsx
function Button({ onPress, children }: { onPress: () => void; children: ReactNode }) {
  return <button onClick={onPress}>{children}</button>;
}

<Button onPress={() => save()}>Save</Button>
```

::tryit{events}

> [!NOTE]
> For a click to change something *on the page*, the component needs **state**. In the example, `useState` does that, which is the topic of the next chapter.
