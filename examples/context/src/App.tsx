import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

// 1. Create the context with a default value
const ThemeContext = createContext<Theme>('light');

function ThemedPanel({ title }: { title: string }) {
  // 3. Read it anywhere below the provider – no props needed in between
  const theme = useContext(ThemeContext);
  const style =
    theme === 'dark'
      ? { background: '#1b1d24', color: '#e8e9ee' }
      : { background: '#f7f7fa', color: '#1b1d24' };
  return (
    <section style={{ ...style, padding: 12, borderRadius: 8, marginBottom: 8 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ margin: 0 }}>Current theme: {theme}</p>
    </section>
  );
}

function Sidebar() {
  return <ThemedPanel title="Sidebar" />;
}

function Layout() {
  return (
    <>
      <Sidebar />
      <ThemedPanel title="Content" />
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    // 2. Provide a value – in React 19 the context itself is the provider
    <ThemeContext value={theme}>
      <h1>Context</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      <Layout />
      <ThemeContext value="light">
        <ThemedPanel title="Always light (nearest provider wins)" />
      </ThemeContext>
    </ThemeContext>
  );
}
