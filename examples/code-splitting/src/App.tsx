import { lazy, Suspense, useState } from 'react';

// The code of Editor is only downloaded when it is rendered for the first time.
const Editor = lazy(() => import('./Editor'));

export default function App() {
  const [editing, setEditing] = useState(false);

  return (
    <main>
      <h1>Code splitting</h1>
      <p>Open the browser's network tab, then click the button: Editor.tsx loads only now.</p>
      <button onClick={() => setEditing(!editing)}>{editing ? 'Close editor' : 'Open editor'}</button>
      {editing && (
        <Suspense fallback={<p>Loading editor …</p>}>
          <Editor />
        </Suspense>
      )}
    </main>
  );
}
