import { useEffect, useState } from 'react';
import { fetchUser, type User } from './api';

// TODO 1: while loading, show <p id="loading">Loading …</p> – also when userId changes
// TODO 2: if fetchUser fails, show <p id="error">{error message}</p>
// TODO 3: fix the race condition: when userId changes before the old request finishes,
//         the old response must be ignored (cleanup function + "ignore" flag)
export default function Profile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then((data) => setUser(data));
  }, [userId]);

  return <p id="user">{user?.name}</p>;
}
