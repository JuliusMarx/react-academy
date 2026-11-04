---
title: useOptimistic
minutes: 8
quiz:
  - question: "What does `useOptimistic` show while an action is running?"
    options: ["The old state","A loading indicator","The optimistic value – as if the action had already succeeded","Nothing"]
    answer: 2
  - question: "The action fails. What happens to the optimistic entry?"
    options: ["It stays forever","You have to delete it manually","React throws an error","It disappears on its own, because `useOptimistic` shows the real state again after the action"]
    answer: 3
  - question: "Where do you have to call the function from `useOptimistic`?"
    options: ["In an action or transition","During rendering","In `useEffect`","Anywhere"]
    answer: 0
exercise:
  example: ex-optimistic
  title: Optimistic todos
  task: |-
    New todos only appear once the server responds after 0.6 seconds. Make them appear immediately:

    1. Create an optimistic list with `useOptimistic(todos, …)`: a new title appends `{ id: -1, title, saving: true }`.
    2. In the action, add the title optimistically before you await `saveTodo`, and display the optimistic list. Todos that aren't saved yet get `className="saving"`.

    If saving fails (a title containing **fail**), the optimistic entry disappears on its own – the error is shown in `#error`.
  checks:
    shows-immediately: A new todo appears immediately with the class `saving`
    confirmed: After saving, it appears in the list exactly once without `saving`
    rollback: If saving fails, it disappears again and the error appears
---

# useOptimistic

For many actions, the result is almost always the same: the message is sent, the like is counted, the todo is saved. Instead of waiting for the server, you can show the result **immediately** and roll back only on failure. This is called **optimistic UI**.

## useOptimistic

```tsx
import { startTransition, useOptimistic, useState } from 'react';

function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, text: string) => [...current, { id: -1, text, sending: true }],
  );

  async function sendAction(formData: FormData) {
    const text = String(formData.get('text'));
    addOptimistic(text); // visible right away
    const saved = await deliver(text);
    startTransition(() => setMessages((m) => [...m, saved]));
  }

  return (
    <>
      <ul>
        {optimisticMessages.map((m) => (
          <li key={m.id}>{m.text} {m.sending && '(sending …)'}</li>
        ))}
      </ul>
      <form action={sendAction}>
        <input name="text" />
        <button>Send</button>
      </form>
    </>
  );
}
```

- `useOptimistic(state, updateFn)` returns an **optimistic copy** of `state` and a function to change it.
- `updateFn` describes how an optimistic value is applied to the current state.
- You display the **optimistic** list, not the real one.

## How it rolls back

The optimistic value only applies **while the action is running**. Once it finishes, `useOptimistic` shows the real state again:

- **Success**: you have updated the real state in the meantime – the entry stays, now without “sending”.
- **Failure**: the real state hasn't changed – the optimistic entry disappears on its own. Show an error message for this.

No cleanup is needed on failure.

> [!NOTE]
> You call the function from `useOptimistic` inside an action or transition. And: state updates **after an `await`** don't (yet) automatically belong to the transition. Wrap them in `startTransition`, as in the example.

## When to go optimistic

Optimistic UI suits actions that almost always succeed and are easy to undo: likes, messages, checkmarks, renaming. For payments or orders, it's better to show an honest loading state.

::tryit{optimistic}
