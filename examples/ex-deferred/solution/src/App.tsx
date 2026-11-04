import { useDeferredValue, useState } from 'react';
import SlowResults from './SlowResults';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <main>
      <h1>City search</h1>
      <label>
        City <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div id="list" className={isStale ? 'stale' : ''}>
        <SlowResults query={deferredQuery} />
      </div>
    </main>
  );
}
