import { useState } from 'react';
import Chart from './Chart';

// TODO 1: don't import Chart statically – load it with lazy(() => import('./Chart'))
// TODO 2: wrap <Chart /> in <Suspense> with the fallback <p id="loading">Loading chart …</p>
export default function App() {
  const [show, setShow] = useState(false);

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={() => setShow(true)}>Show chart</button>
      {show && <Chart />}
    </main>
  );
}
