const user = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  born: 1815,
};

function fullName(u: typeof user) {
  return `${u.firstName} ${u.lastName}`;
}

export default function App() {
  const thisYear = new Date().getFullYear();

  return (
    <main className="card">
      {/* Curly braces embed any JavaScript expression */}
      <h1>{fullName(user)}</h1>
      <p>
        Born {user.born} – that is {thisYear - user.born} years ago.
      </p>
      <p style={{ color: '#087ea4', fontWeight: 'bold' }}>Inline styles are objects.</p>
      <label htmlFor="note">Note</label> <input id="note" placeholder="Self-closing tags need a slash" />
    </main>
  );
}
