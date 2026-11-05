import { useState, type SubmitEvent } from 'react';

export default function App() {
  const [thanks, setThanks] = useState('');

  // TODO 1: keep name and email in state and make both inputs controlled (value + onChange)
  // TODO 2: #preview shows "Hello, <name>!" while typing (or "Hello, stranger!" when empty)
  // TODO 3: the submit button is disabled until the name has at least 2 characters
  //         and the email contains an "@"
  // TODO 4: after submitting, #thanks shows "Thanks, <name>!" and both inputs are empty again

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setThanks('');
  }

  return (
    <main>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Name <input id="name" />
          </label>
        </p>
        <p>
          <label>
            Email <input id="email" type="email" />
          </label>
        </p>
        <p id="preview">Hello, stranger!</p>
        <button type="submit">Sign up</button>
      </form>
      {thanks && <p id="thanks">{thanks}</p>}
    </main>
  );
}
