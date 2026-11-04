import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addTodo, fetchTodos } from './api';

const queryClient = new QueryClient();

function Todos() {
  const client = useQueryClient();
  const [title, setTitle] = useState('');

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const mutation = useMutation({
    mutationFn: addTodo,
    // After a successful change, mark the list as outdated – it is fetched again.
    onSuccess: () => client.invalidateQueries({ queryKey: ['todos'] }),
  });

  if (isPending) return <p>Loading todos …</p>;
  if (isError) return <p role="alert">Error: {error.message}</p>;

  return (
    <>
      <ul>
        {data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      {isFetching && <p>Refreshing …</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(title);
          setTitle('');
        }}
      >
        <label>
          New todo <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>{' '}
        <button type="submit" disabled={mutation.isPending || !title.trim()}>
          {mutation.isPending ? 'Saving …' : 'Add'}
        </button>
      </form>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>TanStack Query</h1>
      <Todos />
    </QueryClientProvider>
  );
}
