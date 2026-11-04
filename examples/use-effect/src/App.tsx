import { useEffect, useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // Runs after every render in which "count" changed – typing a name doesn't trigger it.
  useEffect(() => {
    document.title = `Clicked ${count} times`;
    console.log('Effect ran, count =', count);
  }, [count]);

  return (
    <main>
      <h1>useEffect</h1>
      <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
      <p>
        <label>
          Name <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </p>
      <p>Look at the browser tab title of the preview – and at the console.</p>
    </main>
  );
}
