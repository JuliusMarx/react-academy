import { useState } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store';
import * as slice from './todosSlice';

// The action creators only exist once you've written the reducers.
const actions = slice as unknown as Record<string, (payload: unknown) => { type: string }>;

function Todos() {
  const todos = useAppSelector((s) => s.todos);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');

  return (
    <>
      <ul id="todos">
        {todos.map((t) => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => actions.toggled && dispatch(actions.toggled(t.id))} /> {t.title}
            </label>{' '}
            <button onClick={() => actions.removed && dispatch(actions.removed(t.id))}>Remove</button>
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (actions.added) dispatch(actions.added(title));
          setTitle('');
        }}
      >
        <input id="title" aria-label="New todo" value={title} onChange={(e) => setTitle(e.target.value)} />{' '}
        <button type="submit">Add</button>
      </form>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <h1>Todos</h1>
      <Todos />
    </Provider>
  );
}
