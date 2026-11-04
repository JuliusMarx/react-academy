import { useEffect, useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useEffect(() => {
    document.title = `Clicked ${count} times`;
  }, [count]);

  return (
    <main>
      <h1>Document title</h1>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>
        <label>
          Name <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </p>
    </main>
  );
}
