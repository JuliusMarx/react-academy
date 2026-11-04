---
title: Redux Toolkit
minutes: 9
quiz:
  - question: "Warum darfst du in einem Reducer von `createSlice` scheinbar den State verändern (`state.value += 1`)?"
    options: ["Weil Redux keine Unveränderlichkeit braucht", "Weil Redux Toolkit intern Immer verwendet und daraus eine unveränderliche Aktualisierung macht", "Das darfst du nicht", "Weil der State eine Kopie ist, die verworfen wird"]
    answer: 1
  - question: "Was erzeugt `createSlice` automatisch?"
    options: ["Den Store","Die Komponenten","Den Reducer und zu jedem Reducer einen Action Creator","Die TypeScript-Typen für den Server"]
    answer: 2
  - question: "Wie bekommst du typisierte Versionen von `useSelector` und `useDispatch`?"
    options: ["Mit einem eigenen Context","Gar nicht","Mit `any`","Mit `useSelector.withTypes<RootState>()` und `useDispatch.withTypes<AppDispatch>()`"]
    answer: 3
exercise:
  example: ex-redux
  title: Ein Todo-Slice
  task: |-
    Ergänze in `src/todosSlice.ts` drei Reducer – dank Immer darfst du `state` darin direkt ändern:

    - `added` (Payload: Titel) hängt `{ id: nextId++, title, done: false }` an.
    - `toggled` (Payload: ID) dreht `done` dieses Todos um.
    - `removed` (Payload: ID) entfernt das Todo.

    Exportiere danach die Action Creators: `export const { added, toggled, removed } = todosSlice.actions;`
  checks:
    added: "`added` hängt ein offenes Todo an"
    toggled: "`toggled` hakt ein Todo ab, ohne den alten State zu ändern"
    removed: "`removed` entfernt ein Todo"
    app-works: Hinzufügen und Abhaken funktionieren in der App
---

# Redux Toolkit

**Redux** ist der Klassiker unter den State-Management-Bibliotheken: ein zentraler Store, Änderungen nur über **Actions** und **Reducer**, alles nachvollziehbar in den Redux DevTools. **Redux Toolkit** (RTK) ist die offizielle, moderne Art, Redux zu schreiben – mit deutlich weniger Code als früher.

## Ein Slice

Ein **Slice** bündelt den State eines Bereichs mit seinen Reducern:

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

- `createSlice` erzeugt den **Reducer** und zu jedem Eintrag einen **Action Creator**: `amountAdded(10)` ergibt `{ type: 'counter/amountAdded', payload: 10 }`.
- In den Reducern darfst du `state` scheinbar verändern. RTK verwendet **Immer**, das daraus eine unveränderliche Aktualisierung macht. Alternativ gibst du einen neuen State zurück.

## Der Store

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

Die typisierten Hooks `useAppSelector` und `useAppDispatch` verwendest du in allen Komponenten – dann kennt TypeScript den gesamten State.

## In Komponenten

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

Wie bei Zustand rendert eine Komponente nur neu, wenn sich der ausgewählte Wert ändert.

## Wann Redux?

Redux Toolkit bringt mehr Struktur als Zustand – feste Slices, Actions mit Namen, starke DevTools mit Zeitreise. Das lohnt sich vor allem in großen Apps mit vielen Entwicklern. Für Serverdaten bringt RTK mit **RTK Query** sogar ein eigenes Werkzeug mit, ähnlich wie TanStack Query.

> [!TIP]
> Du siehst in älterem Code `connect`, `mapStateToProps` oder handgeschriebene Action-Typen wie `'INCREMENT'`? Das ist klassisches Redux. Für neuen Code empfiehlt das Redux-Team ausdrücklich Redux Toolkit und die Hooks.

::tryit{redux-store}
