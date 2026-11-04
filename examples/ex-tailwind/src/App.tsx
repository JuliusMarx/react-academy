import Badge from './Badge';

export default function App() {
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Deployments</h1>
      <ul className="space-y-2">
        <li>
          main <Badge status="success">passed</Badge>
        </li>
        <li>
          feature/login <Badge status="error">failed</Badge>
        </li>
      </ul>
    </main>
  );
}
