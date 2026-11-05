import { useEffect, useId, useRef, type ReactNode } from 'react';

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  /** Called after the dialog closed – with "delete", or "" for Cancel and Escape. */
  onClose: (result: string) => void;
};

export default function ConfirmDialog({ open, title, children, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // Synchronize the open prop with the browser's dialog
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.returnValue = '';
      // Modal: top layer, rest of the page inert, Escape closes, focus moves into the dialog
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} aria-labelledby={titleId} onClose={(e) => onClose(e.currentTarget.returnValue)}>
      <h2 id={titleId}>{title}</h2>
      {children}
      {/* method="dialog" closes the dialog and sets returnValue to the button's value */}
      <form method="dialog">
        <button value="">Cancel</button>
        <button value="delete">Delete</button>
      </form>
    </dialog>
  );
}
