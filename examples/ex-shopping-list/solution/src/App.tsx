import { useState, type SubmitEvent } from 'react';

type Item = { id: number; name: string; bought: boolean };

let nextId = 3;

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Bread', bought: false },
    { id: 2, name: 'Apples', bought: false },
  ]);

  function addItem(name: string) {
    setItems([...items, { id: nextId++, name, bought: false }]);
  }

  function toggleItem(id: number) {
    setItems(items.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item)));
  }

  function removeItem(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get('name')).trim();
    if (name) addItem(name);
    e.currentTarget.reset();
  }

  return (
    <main>
      <h1>Shopping list</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Item <input id="new-item" name="name" />
        </label>{' '}
        <button type="submit">Add</button>
      </form>
      <ul id="items">
        {items.map((item) => (
          <li key={item.id} className={item.bought ? 'bought' : ''}>
            <label>
              <input type="checkbox" checked={item.bought} onChange={() => toggleItem(item.id)} /> {item.name}
            </label>{' '}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
