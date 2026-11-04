import { useState } from 'react';
import ThemedButton from './ThemedButton';
import { ThemeContext, type Theme } from './theme';

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

  return (
    <ThemeContext value={theme}>
      <main>
        <h1>Theme: {theme}</h1>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
        <Toolbar />
      </main>
    </ThemeContext>
  );
}
