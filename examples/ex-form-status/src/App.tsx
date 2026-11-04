import { useState } from 'react';
import SubmitButton from './SubmitButton';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [saved, setSaved] = useState<string[]>([]);

  async function save(formData: FormData) {
    await wait(400);
    setSaved((s) => [...s, String(formData.get('title'))]);
  }

  return (
    <main>
      <h1>Notes</h1>
      <form action={save}>
        <label>
          Title <input id="title" name="title" defaultValue="Groceries" />
        </label>{' '}
        <SubmitButton>Save</SubmitButton>
      </form>
      <p id="saved">{saved.join(', ')}</p>
    </main>
  );
}
