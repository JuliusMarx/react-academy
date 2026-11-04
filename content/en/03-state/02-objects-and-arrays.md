---
title: Objects and Arrays in State
minutes: 8
quiz:
  - question: "Why doesn't `items.push(x); setItems(items);` update the display?"
    options: ["`push` is forbidden in React", "It's the same array – React sees no change and doesn't re-render", "Because `setItems` is asynchronous", "It works"]
    answer: 1
    explanation: "React compares the reference. Create a new array, e.g. `setItems([...items, x])`."
  - question: "How do you remove the item with ID 3 from the `todos` state?"
    options: ["`todos.splice(2, 1)`", "`setTodos(todos.filter((t) => t.id !== 3))`", "`delete todos[3]`", "`setTodos(todos.pop())`"]
    answer: 1
  - question: "How do you change only `city` in the `user` state object?"
    options: ["`user.city = 'Paris'`", "`setUser({ city: 'Paris' })`", "`setUser({ ...user, city: 'Paris' })`", "`setUser(user, 'Paris')`"]
    answer: 2
    explanation: "The setter replaces the whole object. With the spread operator, you carry over the remaining fields."
exercise:
  example: ex-shopping-list
  title: A Shopping List
  task: |-
    The list is displayed, but the three functions don't work:

    1. `addItem` modifies the array directly – so React doesn't notice anything. Create a new array instead.
    2. `toggleItem` flips `bought` on the matching item without modifying the existing objects.
    3. `removeItem` removes the item.
  checks:
    adds-item: A new item appears at the end of the list
    toggles-item: The checkbox toggles the `bought` class on and off
    removes-item: "**Remove** removes exactly that item"
---

# Objects and Arrays in State

State can be any value – including objects and arrays. One important rule applies: **never mutate state, replace it.**

## Why immutable?

React decides whether state has changed based on its **reference**. If you modify an object directly and pass it again, it's the same object to React – nothing happens:

```tsx
user.city = 'Paris'; // ✗ mutates the object
setUser(user);       // ✗ same reference – no re-render
```

Create a copy with the changes instead.

## Updating objects

With the **spread operator**, you copy all fields and overwrite individual ones:

```tsx
const [user, setUser] = useState({ name: 'Ada', city: 'London' });

setUser({ ...user, city: 'Paris' });
```

For nested objects, you have to copy every level that changes:

```tsx
setUser({ ...user, address: { ...user.address, city: 'Paris' } });
```

## Updating arrays

Instead of `push`, `splice`, or `arr[i] = …`, you use methods that return a **new array**:

| Action | Instead of … | Use |
|---|---|---|
| Add | `push` | `[...items, newItem]` |
| Remove | `splice` | `items.filter((i) => i.id !== id)` |
| Change | `items[i].done = true` | `items.map((i) => (i.id === id ? { ...i, done: true } : i))` |
| Sort | `sort()` directly | `items.toSorted(…)` or `[...items].sort(…)` |

```tsx
function toggle(id: number) {
  setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
}
```

> [!TIP]
> `toSorted`, `toReversed`, and `with` are newer array methods that never modify the original – ideal for state.

## Don't store derived values

Anything you can calculate from state doesn't belong in state itself:

```tsx
const [todos, setTodos] = useState<Todo[]>([]);
const openCount = todos.filter((t) => !t.done).length; // recalculated on every render
```

This way, `openCount` can never go stale.

::tryit{state-objects-arrays}
