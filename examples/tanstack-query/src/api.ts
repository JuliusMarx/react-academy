export type Todo = { id: number; title: string };

// A fake server: data lives in memory, every call takes a moment.
let todos: Todo[] = [
  { id: 1, title: 'Learn useEffect' },
  { id: 2, title: 'Learn TanStack Query' },
];
let nextId = 3;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchTodos(): Promise<Todo[]> {
  await wait(600);
  return todos;
}

export async function addTodo(title: string): Promise<Todo> {
  await wait(400);
  const todo = { id: nextId++, title };
  todos = [...todos, todo];
  return todo;
}
