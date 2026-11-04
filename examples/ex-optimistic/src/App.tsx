import { startTransition, useState } from 'react';
import { saveTodo, type Todo } from './api';

type ShownTodo = Todo & { saving?: boolean };

export default function App() {
  const [todos, setTodos] = useState<ShownTodo[]>([{ id: 1, title: 'Buy milk' }]);
  const [error, setError] = useState<string | null>(null);

  // TODO 1: create an optimistic version of the list with useOptimistic(todos, …):
  //         adding a title appends { id: -1, title, saving: true }.
  // TODO 2: in the action, add the title optimistically before awaiting saveTodo,
  //         and render the optimistic list. Saving todos get className="saving".
  //         If saving fails, the optimistic todo disappears by itself – show the error in #error.
  async function addAction(formData: FormData) {
    const title = String(formData.get('title'));
    setError(null);
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
        {todos.map((todo) => (
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
