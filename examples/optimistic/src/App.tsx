import { startTransition, useOptimistic, useState } from 'react';

type Message = { id: number; text: string; sending?: boolean };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
let nextId = 2;

async function deliver(text: string): Promise<Message> {
  await wait(1000);
  if (text.toLowerCase().includes('fail')) throw new Error('Could not send the message');
  return { id: nextId++, text };
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([{ id: 1, text: 'Hi there!' }]);
  const [error, setError] = useState<string | null>(null);

  // While an action runs, optimisticMessages contains the message right away.
  // When the action ends, it falls back to "messages" – with or without the new one.
  const [optimisticMessages, addOptimistic] = useOptimistic(messages, (current, text: string) => [
    ...current,
    { id: -1, text, sending: true },
  ]);

  async function sendAction(formData: FormData) {
    const text = String(formData.get('text'));
    setError(null);
    addOptimistic(text);
    try {
      const saved = await deliver(text);
      // State updates after an await need their own transition.
      startTransition(() => setMessages((m) => [...m, saved]));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main>
      <h1>useOptimistic</h1>
      <ul>
        {optimisticMessages.map((m) => (
          <li key={m.id} style={{ opacity: m.sending ? 0.5 : 1 }}>
            {m.text} {m.sending && <small>(sending …)</small>}
          </li>
        ))}
      </ul>
      {error && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
      <form action={sendAction}>
        <label>
          Message <input name="text" required />
        </label>{' '}
        <button type="submit">Send</button>
      </form>
      <p>Type a message containing “fail” to see the rollback.</p>
    </main>
  );
}
