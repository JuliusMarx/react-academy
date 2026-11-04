import { useState } from 'react';

const fruits = ['Apple', 'Apricot', 'Banana', 'Cherry', 'Grape', 'Mango'];

function Profile({ userId }: { userId: string }) {
  // This state resets automatically because the parent passes key={userId}.
  const [comment, setComment] = useState('');
  return (
    <p>
      <label>
        Comment for {userId} <input value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
    </p>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [userId, setUserId] = useState('ada');

  // Derived during rendering – no extra state, no effect.
  const visible = fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase()));

  return (
    <main>
      <h1>You might not need an effect</h1>
      <label>
        Filter <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <p>
        {visible.length} of {fruits.length} shown
      </p>
      <ul>
        {visible.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <h2>Reset state with a key</h2>
      <button onClick={() => setUserId('ada')}>Ada</button>
      <button onClick={() => setUserId('linus')}>Linus</button>
      <Profile key={userId} userId={userId} />
    </main>
  );
}
