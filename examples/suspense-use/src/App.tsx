import { Suspense, use, useState, useTransition } from 'react';
import { getUser } from './api';

function Profile({ userPromise }: { userPromise: ReturnType<typeof getUser> }) {
  // use() suspends until the promise resolves – the nearest <Suspense> shows its fallback meanwhile.
  const user = use(userPromise);
  return (
    <p>
      User #{user.id}: <strong>{user.name}</strong>
    </p>
  );
}

export default function App() {
  const [userId, setUserId] = useState(1);
  const [isPending, startTransition] = useTransition();

  return (
    <main>
      <h1>use() and Suspense</h1>
      {[1, 2, 3].map((id) => (
        <button key={id} onClick={() => setUserId(id)}>
          User {id}
        </button>
      ))}
      <button onClick={() => startTransition(() => setUserId((id) => (id % 3) + 1))}>
        Next (as transition)
      </button>
      {isPending && <span> switching …</span>}

      <Suspense fallback={<p>Loading user …</p>}>
        <Profile userPromise={getUser(userId)} />
      </Suspense>
      <p>Buttons 1–3 show the fallback for users not loaded yet. The transition keeps the old user on screen instead.</p>
    </main>
  );
}
