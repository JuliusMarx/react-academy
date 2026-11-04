import { create } from 'zustand';

type Todo = { id: number; title: string; done: boolean };

type TodoState = {
  todos: Todo[];
  add: (title: string) => void;
  toggle: (id: number) => void;
  clearDone: () => void;
};

let nextId = 2;

export const useTodoStore = create<TodoState>()((set) => ({
  todos: [{ id: 1, title: 'Try Zustand', done: false }],
  add: (title) => set((s) => ({ todos: [...s.todos, { id: nextId++, title, done: false }] })),
  toggle: (id) => set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) })),
  clearDone: () => set((s) => ({ todos: s.todos.filter((t) => !t.done) })),
}));
