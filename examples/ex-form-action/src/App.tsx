import { useState, type FormEvent } from 'react';
import { subscribe } from './api';

export default function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // TODO: replace onSubmit, preventDefault and the controlled input with a form action:
  //   <form action={subscribeAction}> – the function receives the FormData.
  //   Read the email with formData.get('email') (the input needs name="email"),
  //   await subscribe(email) and then show "Subscribed: <email>" in #message.
  //   React clears the uncontrolled input by itself after the action.
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await subscribe(email);
    setMessage(`Subscribed: ${email}`);
  }

  return (
    <main>
      <h1>Newsletter</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>{' '}
        <button type="submit">Subscribe</button>
      </form>
      <p id="message">{message}</p>
    </main>
  );
}
