import { useState } from 'react';

function make(step: number, floor: boolean, reset: boolean) {
  return function Counter() {
    const [count, setCount] = useState(0);
    return (
      <>
        <output aria-label="count">{count}</output>
        <button onClick={() => setCount(count + step)}>Increment</button>
        <button onClick={() => setCount(floor ? Math.max(0, count - 1) : count - 1)}>Decrement</button>
        <button onClick={() => reset && setCount(0)}>Reset</button>
      </>
    );
  };
}

export const mutants = {
  StepTwo: { Counter: make(2, true, true) },
  GoesNegative: { Counter: make(1, false, true) },
  NoReset: { Counter: make(1, true, false) },
};
