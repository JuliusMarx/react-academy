import { lazy, Suspense, useState } from 'react';

const Chart = lazy(() => import('./Chart'));

export default function App() {
  const [show, setShow] = useState(false);

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={() => setShow(true)}>Show chart</button>
      {show && (
        <Suspense fallback={<p id="loading">Loading chart …</p>}>
          <Chart />
        </Suspense>
      )}
    </main>
  );
}
