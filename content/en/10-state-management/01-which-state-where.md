---
title: Which State Goes Where?
minutes: 6
summary: |-
  - First ask what kind of state it is. Most "global state" problems disappear once every piece of state lives in the right place.
  - As local as possible: `useState` or `useReducer` in the deepest component that needs it. If two siblings share it, it moves up to their closest common parent.
  - Server data is not client state: TanStack Query, router loaders or Server Components handle caching and refreshing.
  - Filters, sorting or the current page belong in the URL (`useSearchParams`) – then reloading, sharing and the back button work.
  - Don't store derived values like totals or filtered lists; calculate them during rendering.
  - For app-wide client state, Context is enough when values change rarely – but it re-renders every reader. Zustand and Redux Toolkit let components subscribe to just the part they need via selectors.

  > [!TIP] You only need real state management for app-wide client state like a cart or color scheme – and that is often smaller than you think.
quiz:
  - question: "Where does data from the server belong, e.g. a product list?"
    options: ["In a global store like Redux","In `localStorage`","In a server-data library like TanStack Query or in the router's loaders","In a global variable"]
    answer: 2
    explanation: "Server data needs caching, refetching and error handling – these tools provide all of that. A global store would have to rebuild it all."
  - question: "A filter should survive when the link is shared. Where do you store it?"
    options: ["In `useState`","In a ref","In context","In the URL, e.g. with `useSearchParams`"]
    answer: 3
---

# Which State Goes Where?

Before you reach for a state management library, ask yourself: what kind of state is this, really? Most problems with "global state" disappear once each piece of state lives in the right place.

## Kinds of state

| Kind | Examples | Where? |
|---|---|---|
| Local UI state | open/closed, input, active tab | `useState` / `useReducer` in the component |
| Shared UI state | a selection two siblings need | in the nearest common parent component |
| URL state | filter, sort order, page, selected ID | route parameters and `useSearchParams` |
| Server data | products, users, orders | TanStack Query, router loaders, Server Components |
| Form state | input values, errors, submitting | Form Actions, `useActionState`, possibly React Hook Form |
| App-wide client state | cart, color scheme, login status, editor state | Context – or a store like Zustand or Redux |

Only for the last row do you need "state management" in the narrower sense. And it is often smaller than you think.

## The rules of thumb

1. **As local as possible.** State belongs in the lowest component that needs it. Only when several components share it does it move up.
2. **Server data is not client state.** It belongs to the server – use a tool that handles caching and refreshing.
3. **What belongs in the URL belongs in the URL.** Then reloading, sharing and the back button just work.
4. **Don't store derived values.** Totals, filtered lists and counters are computed during rendering.

## Context or store?

**Context** is built in and is enough for values that rarely change (color scheme, language, signed-in user) or are manageable in size. When a context value changes, however, **all** components that read it re-render.

A **store** like **Zustand** or **Redux Toolkit** pays off when a lot of state is read and changed in many places. Components subscribe only to the part they need (**selectors**) and re-render only when exactly that part changes.

| Aspect | Context + Reducer | Zustand | Redux Toolkit |
|---|---|---|---|
| Installation | built in | small package | two packages |
| Provider required | yes | no | yes |
| Re-rendering | all readers of the context | only when the selector's result changes | only when the selector's result changes |
| Tooling | React DevTools | DevTools middleware | Redux DevTools, RTK Query |
| Fits | small to medium apps | most apps | large apps, large teams |

The next three lessons show all three approaches.
