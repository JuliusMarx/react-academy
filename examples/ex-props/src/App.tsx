import UserBadge from './UserBadge';

export default function App() {
  return (
    <main>
      <h1>Team</h1>
      {/* TODO 3: show three badges: Ada (Admin), Linus (no role), Grace (Editor) */}
      <UserBadge name="Ada" />
    </main>
  );
}
