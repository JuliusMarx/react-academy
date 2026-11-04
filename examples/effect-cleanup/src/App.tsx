import { useEffect, useState } from 'react';

function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    console.log('Clock: start interval');
    const id = setInterval(() => setTime(new Date()), 1000);
    // Cleanup: runs before the effect runs again and when the component disappears.
    return () => {
      console.log('Clock: clear interval');
      clearInterval(id);
    };
  }, []);

  return <p>The time is {time.toLocaleTimeString()}</p>;
}

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <p>Window width: {width}px</p>;
}

export default function App() {
  const [show, setShow] = useState(true);

  return (
    <main>
      <h1>Cleanup</h1>
      <button onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'} clock</button>
      {show && <Clock />}
      <WindowWidth />
      <p>Open the console: in development, StrictMode starts, stops and restarts every effect once.</p>
    </main>
  );
}
