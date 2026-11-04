import { useState, type ChangeEvent } from 'react';
import Button from './Button';
import List from './List';

type User = { id: number; name: string; admin: boolean };

const users: User[] = [
  { id: 1, name: 'Ada', admin: true },
  { id: 2, name: 'Linus', admin: false },
];

// A discriminated union: "status" decides which other props exist.
type Status = { status: 'loading' } | { status: 'error'; message: string } | { status: 'done'; count: number };

function StatusLine(props: Status) {
  switch (props.status) {
    case 'loading':
      return <p>Loading …</p>;
    case 'error':
      return <p>Error: {props.message}</p>;
    case 'done':
      return <p>{props.count} users</p>;
  }
}

export default function App() {
  const [filter, setFilter] = useState('');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);
  }

  const visible = users.filter((u) => u.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <main>
      <h1>TypeScript patterns</h1>
      <input aria-label="Filter" value={filter} onChange={handleChange} />
      <StatusLine status="done" count={visible.length} />
      {/* TypeScript infers T = User: user.admin is known, user.email would be an error */}
      <List items={visible} getKey={(u) => u.id} renderItem={(u) => `${u.name}${u.admin ? ' (admin)' : ''}`} />
      <Button onClick={() => setFilter('')}>Clear</Button>{' '}
      <Button variant="danger" disabled={!filter} title="Only enabled when filtering">
        Danger
      </Button>
    </main>
  );
}
