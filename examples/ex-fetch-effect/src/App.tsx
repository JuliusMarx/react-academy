import { useState } from 'react';
import Profile from './Profile';

export default function App() {
  const [userId, setUserId] = useState(1);

  return (
    <main>
      <h1>Users</h1>
      <label>
        User{' '}
        <select id="user-id" value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </label>
      <Profile userId={userId} />
    </main>
  );
}
