import { create } from 'zustand';

type Todo = { id: number; title: string; done: boolean };

type TodoState = {
  todos: Todo[];
  add: (title: string) => void;
  toggle: (id: number) => void;
  clearDone: () => void;
};

let nextId = 2;

// TODO: implement the three actions with set(). Never change the existing todos – create new ones.
//   add(title)   appends { id: nextId++, title, done: false }
//   toggle(id)   flips "done" of that todo
//   clearDone()  removes all done todos
export const useTodoStore = create<TodoState>()(() => ({
  todos: [{ id: 1, title: 'Try Zustand', done: false }],
  add: () => {},
  toggle: () => {},
  clearDone: () => {},
}));
