import { useState, type FormEvent } from 'react';

let nextId = 5;

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Grape' },
  ]);
  const [query, setQuery] = useState('');

  // Computed during rendering – always up to date, no extra render.
  const visible = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
  const summary = `${visible.length} of ${items.length} shown`;

  function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get('name')).trim();
    if (name) setItems([...items, { id: nextId++, name }]);
    e.currentTarget.reset();
  }

  return (
    <main>
      <h1>Fruits</h1>
      <p>
        <label>
          Filter <input id="filter" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </p>
      <form onSubmit={add}>
        <label>
          New <input id="new" name="name" />
        </label>{' '}
        <button type="submit">Add</button>
      </form>
      <p id="summary">{summary}</p>
      <ul id="items">
        {visible.map((i) => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>
    </main>
  );
}
