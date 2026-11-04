import { useState } from 'react';
import { subscribe } from './api';

export default function App() {
  const [message, setMessage] = useState('');

  async function subscribeAction(formData: FormData) {
    const email = String(formData.get('email'));
    await subscribe(email);
    setMessage(`Subscribed: ${email}`);
  }

  return (
    <main>
      <h1>Newsletter</h1>
      <form action={subscribeAction}>
        <label>
          Email <input id="email" name="email" />
        </label>{' '}
        <button type="submit">Subscribe</button>
      </form>
      <p id="message">{message}</p>
    </main>
  );
}
