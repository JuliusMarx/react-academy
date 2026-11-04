import { startTransition, useOptimistic, useState } from 'react';
import { saveTodo, type Todo } from './api';

type ShownTodo = Todo & { saving?: boolean };

export default function App() {
  const [todos, setTodos] = useState<ShownTodo[]>([{ id: 1, title: 'Buy milk' }]);
  const [error, setError] = useState<string | null>(null);
  const [optimisticTodos, addOptimistic] = useOptimistic(todos, (current, title: string) => [
    ...current,
    { id: -1, title, saving: true },
  ]);

  async function addAction(formData: FormData) {
    const title = String(formData.get('title'));
    setError(null);
    addOptimistic(title);
    try {
      const saved = await saveTodo(title);
      startTransition(() => setTodos((t) => [...t, saved]));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main>
      <h1>Todos</h1>
      <ul id="todos">
        {optimisticTodos.map((todo) => (
          <li key={todo.id} className={todo.saving ? 'saving' : ''}>
            {todo.title}
          </li>
        ))}
      </ul>
      {error && <p id="error">{error}</p>}
      <form action={addAction}>
        <label>
          Todo <input id="title" name="title" />
        </label>{' '}
        <button type="submit">Add</button>
      </form>
    </main>
  );
}
