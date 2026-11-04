import { useState } from 'react';

type Todo = { id: number; title: string; done: boolean };

let nextId = 3;

export default function App() {
  const [user, setUser] = useState({ name: 'Ada', city: 'London' });
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Learn JSX', done: true },
    { id: 2, title: 'Learn state', done: false },
  ]);

  function addTodo() {
    const id = nextId++;
    setTodos([...todos, { id, title: `Task ${id}`, done: false }]);
  }

  function toggle(id: number) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <main>
      <h1>Objects</h1>
      <p>
        {user.name} lives in {user.city}.
      </p>
      <button onClick={() => setUser({ ...user, city: 'Paris' })}>Move to Paris</button>

      <h1>Arrays</h1>
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input type="checkbox" checked={todo.done} onChange={() => toggle(todo.id)} /> {todo.title}
            </label>{' '}
            <button onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
