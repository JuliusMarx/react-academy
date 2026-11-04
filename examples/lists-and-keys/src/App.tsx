import { useState } from 'react';

type Fruit = { id: number; name: string; emoji: string };

const initialFruits: Fruit[] = [
  { id: 1, name: 'Apple', emoji: '🍎' },
  { id: 2, name: 'Banana', emoji: '🍌' },
  { id: 3, name: 'Cherry', emoji: '🍒' },
];

export default function App() {
  const [fruits, setFruits] = useState(initialFruits);

  return (
    <main>
      <h1>Fruits</h1>
      <button onClick={() => setFruits([...fruits].reverse())}>Reverse</button>
      <ul>
        {fruits.map((fruit) => (
          // The key identifies the item. Type a note, then reverse –
          // and try the same with key={index}.
          <li key={fruit.id}>
            {fruit.emoji} {fruit.name} <input aria-label={`Note for ${fruit.name}`} />
          </li>
        ))}
      </ul>
    </main>
  );
}
