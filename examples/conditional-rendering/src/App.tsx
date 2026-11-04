import { useState } from 'react';

type Status = 'loading' | 'error' | 'done';

function StatusMessage({ status }: { status: Status }) {
  // Early return
  if (status === 'loading') return <p>Loading …</p>;
  return status === 'error' ? <p style={{ color: 'crimson' }}>Something went wrong.</p> : <p>All done ✓</p>;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [status, setStatus] = useState<Status>('loading');
  const messages = ['Hi!', 'Lunch?'];

  return (
    <main>
      <h1>{loggedIn ? 'Welcome back!' : 'Please log in'}</h1>
      <button onClick={() => setLoggedIn(!loggedIn)}>{loggedIn ? 'Log out' : 'Log in'}</button>

      {loggedIn && messages.length > 0 && <p>You have {messages.length} new messages.</p>}

      <h2>Status</h2>
      <StatusMessage status={status} />
      <button onClick={() => setStatus('loading')}>loading</button>
      <button onClick={() => setStatus('error')}>error</button>
      <button onClick={() => setStatus('done')}>done</button>
    </main>
  );
}
