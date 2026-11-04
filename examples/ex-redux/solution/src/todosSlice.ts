import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Todo = { id: number; title: string; done: boolean };

let nextId = 2;

export const todosSlice = createSlice({
  name: 'todos',
  initialState: [{ id: 1, title: 'Learn Redux Toolkit', done: false }] as Todo[],
  reducers: {
    added: (state, action: PayloadAction<string>) => {
      state.push({ id: nextId++, title: action.payload, done: false });
    },
    toggled: (state, action: PayloadAction<number>) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    removed: (state, action: PayloadAction<number>) => state.filter((t) => t.id !== action.payload),
  },
});

export const { added, toggled, removed } = todosSlice.actions;
