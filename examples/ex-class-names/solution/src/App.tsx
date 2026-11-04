import { useState } from 'react';
import ProgressBar from './ProgressBar';
import './App.css';

const tabs = ['Profile', 'Settings', 'Billing'];

export default function App() {
  const [active, setActive] = useState('Profile');

  return (
    <main>
      <nav>
        {tabs.map((tab) => (
          <button key={tab} className={tab === active ? 'tab active' : 'tab'} onClick={() => setActive(tab)}>
            {tab}
          </button>
        ))}
      </nav>
      <h1 id="heading">{active}</h1>
      <ProgressBar percent={40} />
    </main>
  );
}
