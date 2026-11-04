import { useState, type FormEvent } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [thanks, setThanks] = useState('');

  // Derived during rendering – no extra state needed.
  const isValid = name.trim().length >= 2 && email.includes('@');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setThanks(`Thanks, ${name}!`);
    setName('');
    setEmail('');
  }

  return (
    <main>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Name <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </p>
        <p>
          <label>
            Email <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </p>
        <p id="preview">Hello, {name || 'stranger'}!</p>
        <button type="submit" disabled={!isValid}>
          Sign up
        </button>
      </form>
      {thanks && <p id="thanks">{thanks}</p>}
    </main>
  );
}
