import { useEffect, useState } from 'react';

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    // The updater function always sees the latest value – no need to list "seconds" as a dependency.
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
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
