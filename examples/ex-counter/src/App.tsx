import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  // TODO 1: "+" adds 1
  function increment() {}

  // TODO 2: "−" subtracts 1, but never goes below 0
  function decrement() {}

  // TODO 3: "+3" calls the state setter three times and must really add 3
  function addThree() {}

  // TODO 4: "Reset" sets the count back to 0
  function reset() {}

  void setCount;

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
