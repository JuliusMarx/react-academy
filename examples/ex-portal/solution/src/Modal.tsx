import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div role="dialog" aria-modal="true" className="modal">
      {children}
      <button onClick={onClose}>Close</button>
    </div>,
    document.body,
  );
}
