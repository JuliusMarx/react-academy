import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Notes from './Notes';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>Notes</h1>
      <Notes />
    </QueryClientProvider>
  );
}
