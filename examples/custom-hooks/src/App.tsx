import { useOnlineStatus } from './useOnlineStatus';
import { useWindowWidth } from './useWindowWidth';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <p>{isOnline ? '✅ Online' : '❌ Offline'}</p>;
}

function SizeInfo() {
  const width = useWindowWidth();
  return <p>Window width: {width}px ({width < 600 ? 'small' : 'large'})</p>;
}

export default function App() {
  return (
    <main>
      <h1>Custom hooks</h1>
      <StatusBar />
      <SizeInfo />
      <p>Each component calls the hook itself – they share the logic, not the state.</p>
    </main>
  );
}
