import { useRef, useState } from 'react';

export default function App() {
  // A ref to a DOM element
  const inputRef = useRef<HTMLInputElement>(null);

  // A ref as a "box" for a value that should survive renders without causing one
  const intervalRef = useRef<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  function start() {
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function stop() {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  return (
    <main>
      <h1>useRef</h1>
      <p>
        <label>
          Search <input ref={inputRef} />
        </label>{' '}
        <button onClick={() => inputRef.current?.focus()}>Focus the input</button>
      </p>

      <h2>Stopwatch: {seconds}s</h2>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </main>
  );
}
