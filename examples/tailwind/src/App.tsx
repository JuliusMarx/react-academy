import { useState } from 'react';

const plans = [
  { name: 'Free', price: 0, features: ['1 project', 'Community support'] },
  { name: 'Pro', price: 12, features: ['Unlimited projects', 'Email support', 'Analytics'], featured: true },
];

export default function App() {
  const [yearly, setYearly] = useState(false);

  return (
    <main className="mx-auto max-w-3xl p-6 font-sans">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Pricing</h1>
      <label className="mb-6 flex items-center gap-2 text-slate-600">
        <input type="checkbox" checked={yearly} onChange={(e) => setYearly(e.target.checked)} />
        Pay yearly (2 months free)
      </label>

      {/* One column on small screens, two from the "md" breakpoint on */}
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-xl border p-6 shadow-sm ${plan.featured ? 'border-sky-600 ring-2 ring-sky-600' : 'border-slate-200'}`}
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="my-3 text-4xl font-bold">
              {yearly ? plan.price * 10 : plan.price} €
              <span className="text-base font-normal text-slate-500">/{yearly ? 'year' : 'month'}</span>
            </p>
            <ul className="mb-4 space-y-1 text-slate-700">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <button className="w-full rounded-lg bg-sky-700 px-4 py-2 font-medium text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700">
              Choose {plan.name}
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
