import { useState } from 'react';
import Modal from './Modal';

export default function App() {
  const [open, setOpen] = useState(false);
  const [clicks, setClicks] = useState(0);

  return (
    // overflow: hidden would cut off a normal child – but not a portal.
    <main style={{ overflow: 'hidden', height: 160, border: '1px dashed #999', padding: 12 }} onClick={() => setClicks((c) => c + 1)}>
      <h1>Portals</h1>
      <button onClick={() => setOpen(true)}>Open dialog</button>
      <p>Clicks that bubbled up to &lt;main&gt;: {clicks}</p>
      {open && (
        <Modal title="Hello from a portal" onClose={() => setOpen(false)}>
          <p>In the DOM this dialog sits in &lt;body&gt;. In React it is still a child of &lt;main&gt; – clicks bubble up.</p>
        </Modal>
      )}
    </main>
  );
}
