import { useState } from 'react';
import ThemedButton from './ThemedButton';
import type { Theme } from './theme';

function Toolbar() {
  return (
    <p>
      <ThemedButton>Save</ThemedButton>
      <ThemedButton>Share</ThemedButton>
    </p>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  // TODO 2: provide the current theme to everything below with <ThemeContext value={…}>
  return (
    <main>
      <h1>Theme: {theme}</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      <Toolbar />
    </main>
  );
}
