// main.tsx renders this component into <div id="root"> of index.html.
import Header from './Header';

export default function App() {
  return (
    <>
      <Header />
      <p>
        Open <code>index.html</code>, <code>src/main.tsx</code> and <code>vite.config.ts</code> to
        see how the pieces fit together.
      </p>
    </>
  );
}
