import { useEffect, useState } from 'react';
import { fetchUser, type User } from './api';

export default function Profile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setUser(null);
    setError(null);
    fetchUser(userId)
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

  if (error) return <p id="error">{error}</p>;
  if (!user) return <p id="loading">Loading …</p>;
  return <p id="user">{user.name}</p>;
}
