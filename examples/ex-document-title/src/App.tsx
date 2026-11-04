import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // TODO: keep the document title in sync with the count: "Clicked 0 times", "Clicked 1 times", …
  //       Use useEffect with the right dependency array.

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
