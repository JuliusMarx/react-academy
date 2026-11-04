import { useRef, useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function clear() {
    if (!inputRef.current) return;
    inputRef.current.value = '';
    inputRef.current.focus();
  }

  return (
    <main>
      <h1>Message</h1>
      <p>
        <label>
          Text <input id="text" ref={inputRef} defaultValue="Hello" />
        </label>
      </p>
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={clear}>Clear</button>
      <button onClick={() => setMessage(inputRef.current?.value ?? '')}>Send</button>
      <p id="message">{message}</p>
    </main>
  );
}
