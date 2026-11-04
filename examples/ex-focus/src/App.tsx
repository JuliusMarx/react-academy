import { useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('');

  // TODO 1: create a ref for the input and attach it with ref={…}
  // TODO 2: "Focus" puts the cursor into the input
  // TODO 3: "Clear" empties the input (it is uncontrolled – set the DOM value via the ref) and focuses it
  // TODO 4: "Send" shows the input's current value in #message

  return (
    <main>
      <h1>Message</h1>
      <p>
        <label>
          Text <input id="text" defaultValue="Hello" />
        </label>
      </p>
      <button>Focus</button>
      <button>Clear</button>
      <button onClick={() => setMessage('')}>Send</button>
      <p id="message">{message}</p>
    </main>
  );
}
