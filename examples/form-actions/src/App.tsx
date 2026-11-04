import { useState } from 'react';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [todos, setTodos] = useState<string[]>(['Learn form actions']);

  // A form action receives the FormData. No preventDefault, no onChange, no state per field.
  async function addTodo(formData: FormData) {
    const title = String(formData.get('title')).trim();
    if (!title) return;
    await wait(500); // pretend to save on a server
    setTodos((t) => [...t, title]);
    // After a successful action React resets the (uncontrolled) form fields by itself.
  }

  return (
    <main>
      <h1>Form actions</h1>
      <form action={addTodo}>
        <label>
          New todo <input name="title" required />
        </label>{' '}
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </main>
  );
}
