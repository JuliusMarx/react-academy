import { useState, type FormEvent } from 'react';

function make(transform: (email: string) => string, validate: boolean) {
  return function SubscribeForm({ onSubscribe }: { onSubscribe: (email: string) => void }) {
    const [error, setError] = useState('');
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const email = String(new FormData(e.currentTarget).get('email')).trim();
      if (!email.includes('@')) {
        setError('Please enter a valid email');
        if (validate) return;
      }
      onSubscribe(transform(email));
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
  };
}

export const mutants = {
  WrongArgument: { SubscribeForm: make((e) => e.toUpperCase(), true) },
  CallsWhenInvalid: { SubscribeForm: make((e) => e, false) },
};
