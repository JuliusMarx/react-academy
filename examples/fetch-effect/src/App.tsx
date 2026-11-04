import { useEffect, useState } from 'react';

type User = { id: number; name: string; email: string };

function Profile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false; // set by the cleanup when userId changes before the response arrives
    setUser(null);
    setError(null);

    fetch(`/api/users/${userId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<User>;
      })
      .then((data) => {
        if (!ignore) setUser(data);
      })
      .catch((e: Error) => {
        if (!ignore) setError(e.message);
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (error) return <p role="alert">Could not load user: {error}</p>;
  if (!user) return <p>Loading …</p>;
  return (
    <p>
      <strong>{user.name}</strong> – {user.email}
    </p>
  );
}

export default function App() {
  const [userId, setUserId] = useState(1);

  return (
    <main>
      <h1>Users</h1>
      <label>
        User{' '}
        <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4 (doesn't exist)</option>
        </select>
      </label>
      <Profile userId={userId} />
    </main>
  );
}
