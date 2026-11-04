import { useState, type FormEvent } from 'react';

// The component under test – you don't need to change it.
export default function SubscribeForm({ onSubscribe }: { onSubscribe: (email: string) => void }) {
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email')).trim();
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    onSubscribe(email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email <input name="email" />
      </label>
      <button type="submit">Subscribe</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
