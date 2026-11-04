import { useState, type FormEvent } from 'react';

type Item = { id: number; name: string; bought: boolean };

let nextId = 3;

export default function App() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'Bread', bought: false },
    { id: 2, name: 'Apples', bought: false },
  ]);

  // TODO 1: add a new item – this version mutates the array, so React doesn't notice the change.
  function addItem(name: string) {
    items.push({ id: nextId++, name, bought: false });
    setItems(items);
  }

  // TODO 2: flip "bought" of the item with this id – without changing the existing objects
  function toggleItem(id: number) {
    void id;
  }

  // TODO 3: remove the item with this id
  function removeItem(id: number) {
    void id;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
