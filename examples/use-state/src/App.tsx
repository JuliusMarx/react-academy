import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  function addThreeWrong() {
    // All three use the same "count" of this render – it only goes up by 1.
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  function addThreeRight() {
    // Updater functions get the latest pending value.
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  return (
    <main>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={addThreeWrong}>+3 (wrong)</button>
      <button onClick={addThreeRight}>+3 (right)</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </main>
  );
}
