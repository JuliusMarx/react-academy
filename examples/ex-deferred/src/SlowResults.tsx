import { memo } from 'react';

const cities = ['Berlin', 'Bern', 'Bremen', 'Hamburg', 'Hannover', 'Munich', 'Münster', 'Vienna', 'Zurich'];

// Deliberately slow – every render takes about 150 ms. You don't need to change this file.
const SlowResults = memo(function SlowResults({ query }: { query: string }) {
  const start = performance.now();
  while (performance.now() - start < 150) {
    /* simulate expensive rendering */
  }
  const hits = cities.filter((c) => c.toLowerCase().startsWith(query.toLowerCase()));
  return (
    <ul id="results">
      {hits.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
  );
});

export default SlowResults;
