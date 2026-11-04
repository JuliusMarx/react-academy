import { useEffect, useState } from 'react';

type User = { id: number; name: string };

export default function UserCard({ userId, onFollow }: { userId: number; onFollow: (id: number) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<User>;
      })
      .then((data) => !ignore && setUser(data))
      .catch((e: Error) => !ignore && setError(e.message));
    return () => {
      ignore = true;
    };
  }, [userId]);

  if (error) return <p role="alert">Could not load user ({error})</p>;
  if (!user) return <p>Loading …</p>;
  return (
    <article>
      <h2>{user.name}</h2>
      <button onClick={() => onFollow(user.id)}>Follow</button>
    </article>
  );
}
