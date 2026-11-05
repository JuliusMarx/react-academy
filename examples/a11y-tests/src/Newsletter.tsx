import { useState, type FormEvent } from 'react';

export default function Newsletter() {
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    setMessage(`Thanks! We sent a confirmation to ${email}.`);
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="newsletter-title">
      <h2 id="newsletter-title">Newsletter</h2>
      <label htmlFor="newsletter-email">Email</label>{' '}
      <input id="newsletter-email" name="email" type="email" required />{' '}
      <button>Subscribe</button>
      {/* The live region is always rendered – only its text changes */}
      <p role="status">{message}</p>
    </form>
  );
}
