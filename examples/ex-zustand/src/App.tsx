import { useState } from 'react';
import { useTodoStore } from './store';

function OpenCount() {
  const open = useTodoStore((s) => s.todos.filter((t) => !t.done).length);
  return <p id="open">{open} open</p>;
}

function TodoList() {
  const todos = useTodoStore((s) => s.todos);
  const toggle = useTodoStore((s) => s.toggle);
  return (
    <ul id="todos">
      {todos.map((t) => (
        <li key={t.id}>
          <label>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} /> {t.title}
          </label>
        </li>
      ))}
    </ul>
  );
}

function AddTodo() {
  const add = useTodoStore((s) => s.add);
  const [title, setTitle] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        add(title);
        setTitle('');
      }}
    >
      <input id="title" aria-label="New todo" value={title} onChange={(e) => setTitle(e.target.value)} />{' '}
      <button type="submit">Add</button>
    </form>
  );
}

export default function App() {
  const clearDone = useTodoStore((s) => s.clearDone);
  return (
    <main>
      <h1>Todos</h1>
      <OpenCount />
      <TodoList />
      <AddTodo />
      <button onClick={clearDone}>Clear done</button>
    </main>
  );
}
