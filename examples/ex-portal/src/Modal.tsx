import type { ReactNode } from 'react';

// TODO 1: render the dialog into document.body with createPortal (from 'react-dom').
// TODO 2: pressing Escape calls onClose (a keydown listener on window in an effect – with cleanup).
export default function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div role="dialog" aria-modal="true" className="modal">
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
