import UserBadge from './UserBadge';

export default function App() {
  return (
    <main>
      <h1>Team</h1>
      <UserBadge name="Ada" role="Admin" />
      <UserBadge name="Linus" />
      <UserBadge name="Grace" role="Editor" />
    </main>
  );
}
