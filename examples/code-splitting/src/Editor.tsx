import { useState } from 'react';

// Imagine a big component with heavy dependencies (a rich-text editor, a chart library …).
export default function Editor() {
  const [text, setText] = useState('Hello!');
  return (
    <section style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginTop: 12 }}>
      <h2>Editor</h2>
      <textarea aria-label="Text" rows={4} cols={40} value={text} onChange={(e) => setText(e.target.value)} />
      <p>{text.length} characters</p>
    </section>
  );
}
