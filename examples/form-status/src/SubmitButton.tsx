import { useFormStatus } from 'react-dom';

// Reads the status of the <form> it is rendered in – no props needed.
export default function SubmitButton({ children }: { children: string }) {
  const { pending, data } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? `Saving “${data?.get('title') ?? ''}” …` : children}
    </button>
  );
}
