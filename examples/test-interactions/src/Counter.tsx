import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(false);

  async function save() {
    await new Promise((r) => setTimeout(r, 300));
    setSaved(true);
  }

  return (
    <>
      <p>
        Count: <output aria-label="count">{count}</output>
      </p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <label>
        Set to <input inputMode="numeric" onChange={(e) => setCount(Number(e.target.value))} />
      </label>
      <button onClick={save}>Save</button>
      {saved && <p>Saved!</p>}
    </>
  );
}
