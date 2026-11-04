import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

function Counter() {
  const [count, setCount] = useState(0);
  if (count >= 3) throw new Error('Counter exploded');
  return (
    <p>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </p>
  );
}

export default function App() {
  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorBoundary>
        <Counter />
      </ErrorBoundary>
      <p id="footer">The rest of the page keeps working.</p>
    </main>
  );
}
