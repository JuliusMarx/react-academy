import { createSlice } from '@reduxjs/toolkit';

export type Todo = { id: number; title: string; done: boolean };

let nextId = 2;

// TODO: add three reducers. Thanks to Immer you may "mutate" state inside them.
//   added(state, action: PayloadAction<string>)   push { id: nextId++, title: action.payload, done: false }
//   toggled(state, action: PayloadAction<number>) flip "done" of that todo
//   removed(state, action: PayloadAction<number>) remove that todo
// Then export the action creators: export const { added, toggled, removed } = todosSlice.actions;
export const todosSlice = createSlice({
  name: 'todos',
  initialState: [{ id: 1, title: 'Learn Redux Toolkit', done: false }] as Todo[],
  reducers: {},
});

void nextId;
