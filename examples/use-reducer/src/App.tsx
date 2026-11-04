import { useReducer, useState } from 'react';
import { todosReducer } from './todosReducer';

export default function App() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: 1, title: 'Learn useState', done: true },
    { id: 2, title: 'Learn useReducer', done: false },
  ]);
  const [title, setTitle] = useState('');

  return (
    <main>
      <h1>Todos</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          dispatch({ type: 'added', title });
          setTitle('');
        }}
      >
        <label>
          New todo <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>{' '}
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input type="checkbox" checked={todo.done} onChange={() => dispatch({ type: 'toggled', id: todo.id })} />{' '}
              {todo.title}
            </label>{' '}
            <button onClick={() => dispatch({ type: 'deleted', id: todo.id })}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch({ type: 'cleared-done' })}>Remove done</button>
    </main>
  );
}
