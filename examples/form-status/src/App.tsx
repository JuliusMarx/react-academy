import { useState } from 'react';
import SubmitButton from './SubmitButton';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [saved, setSaved] = useState<string[]>([]);

  async function save(formData: FormData) {
    await wait(800);
    setSaved((s) => [...s, String(formData.get('title'))]);
  }

  return (
    <main>
      <h1>useFormStatus</h1>
      <form action={save}>
        <label>
          Post title <input name="title" defaultValue="Hello world" />
        </label>{' '}
        <SubmitButton>Publish</SubmitButton>
      </form>
      <form action={save} style={{ marginTop: 12 }}>
        <label>
          Draft title <input name="title" defaultValue="Ideas" />
        </label>{' '}
        <SubmitButton>Save draft</SubmitButton>
      </form>
      <p>Saved: {saved.join(', ') || '–'}</p>
    </main>
  );
}
