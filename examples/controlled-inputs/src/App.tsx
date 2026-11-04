import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('free');
  const [newsletter, setNewsletter] = useState(true);

  return (
    <main>
      <h1>Sign up</h1>
      <p>
        <label>
          Name <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </p>
      <p>
        <label>
          Plan{' '}
          <select value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        </label>
      </p>
      <p>
        <label>
          <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} /> Newsletter
        </label>
      </p>
      <p>
        Hello {name || 'stranger'} – plan: {plan}, newsletter: {newsletter ? 'yes' : 'no'}.
      </p>
      <button disabled={name.trim().length < 2} onClick={() => setName(name.toUpperCase())}>
        Shout my name
      </button>
    </main>
  );
}
