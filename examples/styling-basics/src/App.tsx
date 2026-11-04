import { useState, type CSSProperties } from 'react';
import './App.css';

type Variant = 'info' | 'success' | 'danger';

function Alert({ variant, children }: { variant: Variant; children: string }) {
  // Build the class list from props – here with a template string.
  return <p className={`alert alert-${variant}`}>{children}</p>;
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [progress, setProgress] = useState(30);

  return (
    // Conditional class: "page" always, "dark" only when dark is true
    <main className={['page', dark && 'dark'].filter(Boolean).join(' ')}>
      <h1>Styling basics</h1>
      <button onClick={() => setDark(!dark)}>{dark ? 'Light' : 'Dark'} mode</button>

      <Alert variant="info">Classes come from App.css.</Alert>
      <Alert variant="success">Saved!</Alert>
      <Alert variant="danger">Something went wrong.</Alert>

      <h2>Inline styles for dynamic values</h2>
      <div className="track">
        <div className="bar" style={{ width: `${progress}%` }} />
      </div>
      <button onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10 %</button>

      <h2>CSS variables</h2>
      <p className="swatch" style={{ '--swatch': dark ? '#58c4dc' : '#087ea4' } as CSSProperties}>
        This color comes from a CSS variable set in JSX.
      </p>
    </main>
  );
}
