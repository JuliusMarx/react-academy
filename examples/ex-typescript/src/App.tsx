import { useState } from 'react';
import Button from './Button';

export default function App() {
  const [deleted, setDeleted] = useState(false);

  return (
    <main>
      <h1>Account</h1>
      <p id="status">{deleted ? 'Account deleted' : 'Active'}</p>
      {/* These props only type-check once Button accepts all native button props. */}
      {/* @ts-expect-error – remove this line when Button is done */}
      <Button variant="danger" onClick={() => setDeleted(true)} disabled={deleted} aria-label="Delete account">
        Delete
      </Button>
    </main>
  );
}
