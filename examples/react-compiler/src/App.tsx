import { useRef, useState } from 'react';

const products = Array.from({ length: 50 }, (_, i) => ({ id: i, name: `Product ${i}`, price: (i * 7) % 40 }));

// No memo, no useMemo, no useCallback – the compiler adds the equivalent automatically.
function ProductList({ maxPrice, onPick }: { maxPrice: number; onPick: (id: number) => void }) {
  const renders = useRef(0);
  renders.current++;
  const visible = products.filter((p) => p.price <= maxPrice);
  return (
    <>
      <p>ProductList rendered {renders.current} times</p>
      <p>
        {visible.slice(0, 12).map((p) => (
          <button key={p.id} onClick={() => onPick(p.id)}>
            {p.name}
          </button>
        ))}
      </p>
    </>
  );
}

export default function App() {
  const [maxPrice, setMaxPrice] = useState(20);
  const [note, setNote] = useState('');
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <main>
      <h1>React Compiler</h1>
      <label>
        Max price <input type="range" min={0} max={40} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />{' '}
        {maxPrice} €
      </label>
      <p>
        <label>
          Note <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </p>
      <p>Picked: {picked ?? '–'}</p>
      <ProductList maxPrice={maxPrice} onPick={(id) => setPicked(id)} />
      <p>Type a note: the render count of ProductList stays the same. Remove the compiler from vite.config.ts and try again.</p>
    </main>
  );
}
