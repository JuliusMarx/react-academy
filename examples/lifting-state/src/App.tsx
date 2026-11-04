import { useState, type ReactNode } from 'react';

type PanelProps = {
  title: string;
  isActive: boolean;
  onShow: () => void;
  children: ReactNode;
};

function Panel({ title, isActive, onShow, children }: PanelProps) {
  return (
    <section style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </section>
  );
}

export default function App() {
  // The parent owns the state – so only one panel can be open at a time.
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main>
      <h1>Accordion</h1>
      <Panel title="About" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
        React is a library for building user interfaces.
      </Panel>
      <Panel title="Components" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
        Components are functions that return JSX.
      </Panel>
    </main>
  );
}
