---
title: Lists and keys
minutes: 8
quiz:
  - question: "What is the `key` for in list items?"
    options: ["It is output as an HTML attribute", "React uses it to tell which element is which when the list changes", "It sorts the list", "It only matters for TypeScript"]
    answer: 1
  - question: "What makes the best `key`?"
    options: ["`Math.random()`", "The index from `map`", "A stable, unique ID from the data", "The displayed text"]
    answer: 2
    explanation: "Random values change on every render, and the index changes when you sort or delete. An ID stays stable."
exercise:
  example: ex-lists
  title: A product list
  task: |-
    1. Render an `<li>` for each product inside `<ul id="products">`, with name and price, e.g. **Coffee – 3.50 €**. Don't forget the `key`.
    2. Products that are out of stock additionally show `<span className="sold-out">sold out</span>`.
    3. If the list is empty (button **Clear**), show `<p id="empty">No products</p>` instead.
  checks:
    renders-items: Three list items with name and price
    sold-out: Only Tea is marked as **sold out**
    empty-state: After **Clear**, **No products** appears
---

# Lists and keys

In React, you create lists with the array method **`map`**: each data item becomes a JSX element.

## Lists with map

```tsx
const fruits = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit.id}>{fruit.name}</li>
      ))}
    </ul>
  );
}
```

To filter, call `filter` first:

```tsx
{fruits.filter((f) => f.inStock).map((f) => <li key={f.id}>{f.name}</li>)}
```

## Why key?

When a list changes (an item is added, removed, or the order changes), React needs to know which element is which. That's how React figures out what it can reuse and where state (e.g. the contents of an input field) belongs.

- The `key` must be **unique** among siblings.
- It must stay **stable**: the same value for the same element on every render.
- The best choice is an **ID from the data**.

> [!WARNING]
> The index (`map((f, i) => <li key={i}>`) only works for lists that never get reordered or changed. Otherwise state "moves" to the wrong element. Try it in the example: type a note, reverse the list, then repeat with `key={index}`.

`Math.random()` as a key is even worse: React then rebuilds all elements on every render.

## Empty lists

Combine the list with conditional rendering:

```tsx
{fruits.length === 0 ? <p>No fruits.</p> : <ul>{/* … */}</ul>}
```

::tryit{lists-and-keys}
