---
title: What is React?
minutes: 6
summary: |-
  - React is a JavaScript library for building user interfaces, developed at Meta and open source.
  - A React app is made of **components**: functions that describe what appears on screen. Components nest like HTML tags.
  - The HTML-like `<h1>` inside JavaScript is called **JSX**.
  - React is declarative: you describe *what* to show for the current state. When the state changes, React calls the function again and updates only the parts of the DOM that changed.
  - React only handles the UI. Routing and data loading come from other libraries (React Router, TanStack Query) or a framework like Next.js.
  - This course uses React 19, TypeScript, and Vite.

  ```tsx
  function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count} clicks</button>;
  }
  ```

  > [!TIP] Thanks to *Fast Refresh*, you see changes as soon as you save – and the state is kept.
quiz:
  - question: "What is React?"
    options: ["A complete framework with a router, HTTP client, and forms", "A JavaScript library for building user interfaces", "A programming language that compiles to JavaScript", "A CSS framework"]
    answer: 1
    explanation: "React takes care of the user interface. Routing, data loading, and the rest come from additional libraries or a framework like Next.js."
  - question: "What do you describe in React when you write a component?"
    options: ["The individual DOM commands that run when a click happens","The CSS animations of the page","What the UI should look like for the current state","The database tables of the app"]
    answer: 2
    explanation: "React is declarative: you describe the result, and React brings the DOM up to date on its own."
---

# What is React?

**React** is a JavaScript library for building user interfaces. It was developed at Meta (Facebook), is open source, and is one of the most widely used technologies for modern web apps.

## The core idea: components

A React app is made of **components**: small, reusable building blocks. A component is simply a JavaScript function that describes what should appear on the screen:

```tsx
function Welcome() {
  return <h1>Hello, React!</h1>;
}
```

The `<h1>` in the middle of the JavaScript is called **JSX**. More on that in chapter 2. Components can be nested like HTML tags: an `App` contains a `Header`, a `ProductList`, and a `Footer`, and the `ProductList` contains many `ProductCard`s.

## Declarative instead of imperative

Without React, you write down step by step *how* the page should change: find an element, set its text, add a class, remove an element... With React, you only describe *what* should be shown for the current state:

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count} clicks</button>;
}
```

When `count` changes, React calls the function again and updates exactly the parts of the DOM that changed. You don't have to worry about the "how".

## React is a library

React only takes care of the user interface. For routing, data loading, or forms, you reach for additional libraries (e.g. React Router, TanStack Query), or for a **framework** like Next.js or React Router (framework mode) that comes with these parts included.

| Topic | Who handles it? |
|---|---|
| Components, state, rendering | React |
| Project setup, dev server, build | Vite (or a framework) |
| Pages and URLs | e.g. React Router |
| Data from the server | `fetch`, TanStack Query, framework loaders |

In this course, you work with **React 19**, **TypeScript**, and **Vite**, just like in most new projects.

::tryit{hello-react}

> [!TIP]
> Change the heading in the example and save. The preview updates immediately, without resetting the counter. This is called *Fast Refresh*.
