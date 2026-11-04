import Avatar from './Avatar';

function Welcome() {
  return <p>Welcome to the React Academy!</p>;
}

export default function App() {
  return (
    <main>
      <h1>Components</h1>
      <Welcome />
      <Avatar />
      <Avatar />
    </main>
  );
}
