import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Rendered into document.body – outside of every parent with overflow: hidden or z-index.
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgb(0 0 0 / 40%)', display: 'grid', placeItems: 'center' }}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{ background: 'white', padding: 24, borderRadius: 12, minWidth: 280 }}>
        <h2 id="modal-title">{title}</h2>
        {children}
        <button ref={closeRef} onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}
