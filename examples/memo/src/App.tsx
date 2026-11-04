import { memo, useCallback, useMemo, useState } from 'react';

const numbers = Array.from({ length: 2000 }, (_, i) => i + 1);

function isPrime(n: number) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

let listRenders = 0;

const NumberList = memo(function NumberList({ items, onPick }: { items: number[]; onPick: (n: number) => void }) {
  listRenders++;
  return (
    <>
      <p>NumberList rendered {listRenders} times</p>
      <p>
        {items.slice(0, 30).map((n) => (
          <button key={n} onClick={() => onPick(n)}>
            {n}
          </button>
        ))}
      </p>
    </>
  );
});

export default function App() {
  const [onlyPrimes, setOnlyPrimes] = useState(true);
  const [note, setNote] = useState('');
  const [picked, setPicked] = useState<number | null>(null);

  // Recomputed only when onlyPrimes changes – not while typing a note.
  const items = useMemo(() => (onlyPrimes ? numbers.filter(isPrime) : numbers), [onlyPrimes]);

  // Same function object across renders, so memo(NumberList) can skip rendering.
  const handlePick = useCallback((n: number) => setPicked(n), []);

  return (
    <main>
      <h1>memo, useMemo, useCallback</h1>
      <label>
        <input type="checkbox" checked={onlyPrimes} onChange={(e) => setOnlyPrimes(e.target.checked)} /> Only primes
      </label>
      <p>
        <label>
          Note <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </p>
      <p>Picked: {picked ?? '–'}</p>
      <NumberList items={items} onPick={handlePick} />
      <p>Type a note: the render count stays the same. Remove useCallback and watch it go up.</p>
    </main>
  );
}
