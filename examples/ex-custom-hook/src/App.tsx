import { useLocalStorage } from './useLocalStorage';

export default function App() {
  const [name, setName] = useLocalStorage('name', '');
  const [dark, setDark] = useLocalStorage('dark-mode', false);

  return (
    <main>
      <h1>Settings</h1>
      <p>
        <label>
          Name <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </p>
      <p>
        <label>
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> Dark mode
        </label>
      </p>
      <p>Reload the preview – the settings survive.</p>
    </main>
  );
}
