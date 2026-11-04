import { useState } from 'react';

// The component under test – you don't need to change it.
export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <output aria-label="count">{count}</output>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(Math.max(0, count - 1))}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </>
  );
}
