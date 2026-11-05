import { useState, type FormEvent } from 'react';
import TextField from './TextField';

export default function App() {
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email'));
    const error = email.includes('@') ? '' : 'Enter an email address with an @.';
    setEmailError(error);
    setSent(!error);
  }

  return (
    <main>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit} noValidate>
        <TextField label="Name" name="name" hint="As it should appear on your badge." />
        <TextField label="Email" name="email" type="email" hint="We never share it." error={emailError} />
        <button>Sign up</button>
      </form>
      {sent && <p>Thanks for signing up!</p>}
    </main>
  );
}
