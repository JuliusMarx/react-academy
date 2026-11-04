import { memo, useDeferredValue, useState, useTransition } from 'react';

const words = Array.from({ length: 300 }, (_, i) => `item-${i}-${['apple', 'banana', 'cherry', 'grape'][i % 4]}`);

// Deliberately slow: every row burns ~1 ms.
const SlowList = memo(function SlowList({ query }: { query: string }) {
  const rows = words.filter((w) => w.includes(query));
  return (
    <ul>
      {rows.map((w) => {
        const start = performance.now();
        while (performance.now() - start < 1) {
          /* simulate expensive rendering */
        }
        return <li key={w}>{w}</li>;
      })}
    </ul>
  );
});

const tabs = ['Home', 'Slow list', 'About'];

export default function App() {
  const [query, setQuery] = useState('');
  // The list renders with the old query until React has time – the input stays responsive.
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  const [tab, setTab] = useState('Home');
  const [isPending, startTransition] = useTransition();

  return (
    <main>
      <h1>useDeferredValue & useTransition</h1>
      <nav>
        {tabs.map((t) => (
          <button key={t} onClick={() => startTransition(() => setTab(t))} disabled={t === tab}>
            {t}
          </button>
        ))}
        {isPending && <span> loading tab …</span>}
      </nav>

      {tab === 'Slow list' ? (
        <>
          <label>
            Filter <input value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <div style={{ opacity: isStale ? 0.5 : 1 }}>
            <SlowList query={deferredQuery} />
          </div>
        </>
      ) : (
        <p>This is the {tab} tab. Switch to “Slow list” and type into the filter.</p>
      )}
    </main>
  );
}
