import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Hello, React!</h1>
      <p>This is a real React app running in your browser.</p>
      <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
      <p>
        Try it: change the heading in <code>src/App.tsx</code> and save – the preview updates
        instantly.
      </p>
    </main>
  );
}
