import { useEffect, useState, type SubmitEvent } from 'react';

let nextId = 5;

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Grape' },
  ]);
  const [query, setQuery] = useState('');

  // TODO: this state and effect only copy data that can be computed from items and query.
  //       It even has a bug: new items don't show up, because "items" is missing in the dependencies.
  //       Remove both and compute the visible items (and the summary) during rendering.
  const [visible, setVisible] = useState(items);
  const [summary, setSummary] = useState('');
  useEffect(() => {
    const result = items.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));
    setVisible(result);
    setSummary(`${result.length} of ${items.length} shown`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function add(e: SubmitEvent<HTMLFormElement>) {
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
