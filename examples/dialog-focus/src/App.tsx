import { useRef, useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const initialFiles = [
  { id: 1, name: 'notes.txt' },
  { id: 2, name: 'photo.jpg' },
  { id: 3, name: 'budget.xlsx' },
];

export default function App() {
  const [files, setFiles] = useState(initialFiles);
  const [pending, setPending] = useState<{ id: number; name: string } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  function handleClose(result: string) {
    if (result === 'delete' && pending) {
      setFiles((all) => all.filter((f) => f.id !== pending.id));
      // The browser would return the focus to the Delete button – but that button disappears.
      // So move it somewhere sensible: the list heading (tabIndex={-1} makes it focusable).
      headingRef.current?.focus();
    }
    setPending(null);
  }

  return (
    <main>
      <h1 ref={headingRef} tabIndex={-1}>
        Files ({files.length})
      </h1>
      <p>Use only the keyboard: Tab to a Delete button, Enter, then Escape or Tab + Enter.</p>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.name}{' '}
            <button onClick={() => setPending(file)} aria-label={`Delete ${file.name}`}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => setFiles(initialFiles)}>Reset</button>

      <ConfirmDialog open={pending !== null} title="Delete file?" onClose={handleClose}>
        <p>{pending?.name} will be deleted.</p>
      </ConfirmDialog>
    </main>
  );
}
