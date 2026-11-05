export type Todo = { id: number; title: string; done: boolean };

export type TodoAction =
  | { type: 'added'; id: number; title: string }
  | { type: 'toggled'; id: number }
  | { type: 'deleted'; id: number }
  | { type: 'cleared-done' };

// A reducer is a pure function: (current state, action) => next state.
export function todosReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'added':
      return [...todos, { id: action.id, title: action.title, done: false }];
    case 'toggled':
      return todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'deleted':
      return todos.filter((t) => t.id !== action.id);
    case 'cleared-done':
      return todos.filter((t) => !t.done);
  }
}
