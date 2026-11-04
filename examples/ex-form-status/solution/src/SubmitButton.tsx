import { useFormStatus } from 'react-dom';

export default function SubmitButton({ children }: { children: string }) {
  const { pending, data } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? `Saving ${data?.get('title') ?? ''} …` : children}
    </button>
  );
}
