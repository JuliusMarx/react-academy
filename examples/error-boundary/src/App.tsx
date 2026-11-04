import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

function Bomb() {
  const [clicks, setClicks] = useState(0);
  if (clicks >= 3) throw new Error('💥 I exploded after 3 clicks');
  return <button onClick={() => setClicks(clicks + 1)}>Click me ({3 - clicks} left)</button>;
}

export default function App() {
  return (
    <main>
      <h1>Error boundaries</h1>
      <ErrorBoundary
        fallback={(error, reset) => (
          <div role="alert" style={{ border: '1px solid crimson', padding: 12, borderRadius: 8 }}>
            <p>Something went wrong: {error.message}</p>
            <button onClick={reset}>Try again</button>
          </div>
        )}
      >
        <Bomb />
      </ErrorBoundary>
      <p>This text is outside the boundary – it stays visible when the bomb explodes.</p>
    </main>
  );
}
