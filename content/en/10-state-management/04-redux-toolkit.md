---
title: Redux Toolkit
minutes: 9
summary: |-
  - Redux Toolkit (RTK) is the official, modern way to write Redux: one central store, changes only through actions and reducers.
  - `createSlice` bundles an area's state with its reducers and generates an action creator for each reducer: `amountAdded(10)` yields `{ type: 'counter/amountAdded', payload: 10 }`.
  - Thanks to Immer you may seemingly mutate `state` inside a reducer. Alternatively, return a new state.
  - `configureStore` builds the store. You get typed hooks with `useSelector.withTypes<RootState>()` and `useDispatch.withTypes<AppDispatch>()`.
  - `<Provider store={store}>` wraps the app. Components only re-render when the selected value changes.
  - RTK pays off mainly in large apps with many developers; for server data it ships RTK Query.

  ```ts
  export const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0 },
    reducers: {
      incremented: (state) => {
        state.value += 1;
      },
    },
  });
  export const { incremented } = counterSlice.actions;

  // in a component
  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch(); // dispatch(incremented())
  ```

  > [!TIP] `connect`, `mapStateToProps` and action types like `'INCREMENT'` are classic Redux – for new code, use RTK and the hooks.
quiz:
  - question: "Why can you seemingly mutate the state (`state.value += 1`) in a `createSlice` reducer?"
    options: ["Because Redux doesn't need immutability", "Because Redux Toolkit uses Immer internally and turns it into an immutable update", "You can't", "Because the state is a copy that gets discarded"]
    answer: 1
  - question: "What does `createSlice` generate automatically?"
    options: ["The store","The components","The reducer and an action creator for each reducer function","The TypeScript types for the server"]
    answer: 2
  - question: "How do you get typed versions of `useSelector` and `useDispatch`?"
    options: ["With a custom context","You can't","With `any`","With `useSelector.withTypes<RootState>()` and `useDispatch.withTypes<AppDispatch>()`"]
    answer: 3
exercise:
  example: ex-redux
  title: A Todo Slice
  task: |-
    Add three reducers in `src/todosSlice.ts` – thanks to Immer you may change `state` directly in them:

    - `added` (payload: title) appends `{ id: nextId++, title, done: false }`.
    - `toggled` (payload: ID) flips `done` on that todo.
    - `removed` (payload: ID) removes the todo.

    Then export the action creators: `export const { added, toggled, removed } = todosSlice.actions;`
  checks:
    added: "`added` appends an open todo"
    toggled: "`toggled` checks off a todo without changing the old state"
    removed: "`removed` removes a todo"
    app-works: Adding and checking off work in the app
---

# Redux Toolkit

**Redux** is the classic among state management libraries: one central store, changes only through **actions** and **reducers**, everything traceable in the Redux DevTools. **Redux Toolkit** (RTK) is the official, modern way to write Redux – with far less code than before.

## A slice

A **slice** bundles the state of one area with its reducers:

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => {
      state.value += 1;
    },
    amountAdded: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { incremented, amountAdded } = counterSlice.actions;
```

- `createSlice` generates the **reducer** and an **action creator** for each entry: `amountAdded(10)` yields `{ type: 'counter/amountAdded', payload: 10 }`.
- In the reducers you may seemingly mutate `state`. RTK uses **Immer**, which turns that into an immutable update. Alternatively, you return a new state.

## The store

```ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
```

Use the typed hooks `useAppSelector` and `useAppDispatch` in all components – then TypeScript knows the entire state.

## In components

```tsx
import { Provider } from 'react-redux';

function Counter() {
  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  return <button onClick={() => dispatch(incremented())}>{value}</button>;
}

export default function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

As with Zustand, a component re-renders only when the selected value changes.

## When to use Redux?

Redux Toolkit brings more structure than Zustand – fixed slices, named actions, powerful DevTools with time travel. That pays off mostly in large apps with many developers. For server data, RTK even ships its own tool, **RTK Query**, similar to TanStack Query.

> [!TIP]
> Do you see `connect`, `mapStateToProps` or hand-written action types like `'INCREMENT'` in older code? That is classic Redux. For new code, the Redux team explicitly recommends Redux Toolkit and the hooks.

::tryit{redux-store}
