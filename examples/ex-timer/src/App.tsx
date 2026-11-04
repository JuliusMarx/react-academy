import { useEffect, useState } from 'react';

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  // TODO 1: while "running" is true, add 1 to "seconds" every 1000 ms (setInterval).
  // TODO 2: return a cleanup function that clears the interval – otherwise Stop doesn't stop it.
  useEffect(() => {
    if (!running) return;
  }, [running]);

  return (
    <main>
      <h1>
        Timer: <output id="seconds">{seconds}</output> s
      </h1>
      <button onClick={() => setRunning(true)}>Start</button>
      <button onClick={() => setRunning(false)}>Stop</button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </main>
  );
}
