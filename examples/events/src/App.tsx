import { useState, type FormEvent } from 'react';

export default function App() {
  const [log, setLog] = useState<string[]>([]);
  const add = (entry: string) => setLog((l) => [entry, ...l].slice(0, 5));

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // otherwise the browser reloads the page
    const data = new FormData(e.currentTarget);
    add(`Form submitted: ${data.get('city')}`);
  }

  return (
    <main>
      <h1>Events</h1>
      <button onClick={() => add('Button clicked')}>Click me</button>
      <button onMouseEnter={() => add('Mouse entered')}>Hover me</button>

      <div onClick={() => add('Div clicked (bubbling)')} style={{ padding: 12, margin: '8px 0', background: '#e3f4f9' }}>
        <button onClick={() => add('Inner button – the div hears it too')}>Inner button</button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            add('Stopped – the div hears nothing');
          }}
        >
          Inner button (stopPropagation)
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          City <input name="city" defaultValue="Berlin" />
        </label>{' '}
        <button type="submit">Submit</button>
      </form>

      <h2>Log</h2>
      <ol>
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ol>
    </main>
  );
}
