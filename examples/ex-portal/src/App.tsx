import { useState } from 'react';
import Modal from './Modal';

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <main style={{ overflow: 'hidden', height: 120 }}>
      <h1>Settings</h1>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <p>Are you sure?</p>
        </Modal>
      )}
    </main>
  );
}
