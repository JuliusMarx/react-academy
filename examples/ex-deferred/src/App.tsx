import { useState } from 'react';
import SlowResults from './SlowResults';

// TODO 1: pass a deferred version of the query to SlowResults: useDeferredValue(query).
//         The input then updates immediately, the slow list follows when React has time.
// TODO 2: while the list shows an older query, give its wrapper <div id="list"> the class "stale".
export default function App() {
  const [query, setQuery] = useState('');

  return (
    <main>
      <h1>City search</h1>
      <label>
        City <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <div id="list">
        <SlowResults query={query} />
      </div>
    </main>
  );
}
