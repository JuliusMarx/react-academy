import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  function decrement() {
    setCount(Math.max(0, count - 1));
  }

  function addThree() {
    // Updater functions build on each other – setCount(count + 1) three times would only add 1.
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <main>
      <h1>
        Count: <output id="count">{count}</output>
      </h1>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>−</button>
      <button onClick={addThree}>+3</button>
      <button onClick={reset}>Reset</button>
    </main>
  );
}
