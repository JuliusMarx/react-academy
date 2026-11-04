import { useState } from 'react';
import ProductList from './ProductList';

const allProducts = [
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Cocoa' },
  { id: 3, name: 'Tea' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [note, setNote] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  // TODO 2: this creates a new array on every render – keep it stable with useMemo
  const products = allProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  // TODO 3: this creates a new function on every render – keep it stable with useCallback
  const handleSelect = (id: number) => setSelected(id);

  return (
    <main>
      <h1>Products</h1>
      <p>
        <label>
          Filter <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </p>
      <p>
        <label>
          Note <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </p>
      <p id="selected">Selected: {selected ?? 'none'}</p>
      <ProductList products={products} onSelect={handleSelect} />
    </main>
  );
}
