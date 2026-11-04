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
          // TODO 1: every tab has the class "tab"; the active one additionally "active"
          // TODO 2: clicking a tab makes it the active one
          <button key={tab}>{tab}</button>
        ))}
      </nav>
      <h1 id="heading">{active}</h1>
      <ProgressBar percent={40} />
    </main>
  );
}
