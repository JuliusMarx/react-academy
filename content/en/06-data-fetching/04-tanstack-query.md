---
title: TanStack Query
minutes: 9
summary: |-
  - TanStack Query handles loading, caching, refetching, and errors for server data.
  - Setup: `npm install @tanstack/react-query`, then wrap the app in `<QueryClientProvider client={queryClient}>`.
  - `useQuery({ queryKey, queryFn })` returns `data`, `isPending`, `isError`, and `error`.
  - The `queryKey` identifies the data in the cache; values the request depends on belong in it: `['todo', id]`.
  - The library refetches stale data automatically, e.g. when you return to the tab. `staleTime` sets how long data counts as fresh.
  - `useMutation` changes data; `queryClient.invalidateQueries` then makes sure lists are refreshed.

  ```tsx
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isPending) return <p>Loading …</p>;
  if (isError) return <p role="alert">{error.message}</p>;
  return <ul>{data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>;
  ```

  > [!TIP] The TanStack Query Devtools show which queries are in the cache and whether they are stale.
quiz:
  - question: "What is the `queryKey` for?"
    options: ["It is the URL of the request","It sorts the results","It is an API key","It identifies the data in the cache – identical keys share the same data"]
    answer: 3
  - question: "After saving a new entry, the list should be reloaded. What do you call?"
    options: ["`queryClient.invalidateQueries({ queryKey: ['todos'] })`","`window.location.reload()`","`useQuery` again","`setTodos`"]
    answer: 0
  - question: "What do you need for `useQuery` to work?"
    options: ["A server of your own","A `QueryClientProvider` with a `QueryClient` higher up in the tree","Redux","Nothing"]
    answer: 1
exercise:
  example: ex-query
  title: Notes with TanStack Query
  task: |-
    `Notes` loads the notes with an effect. New notes are saved, but they don't show up.

    1. Replace the state and effect with `useQuery({ queryKey: ['notes'], queryFn: fetchNotes })`. Show `<p id="loading">Loading …</p>` in the meantime.
    2. Save with `useMutation({ mutationFn: addNote, … })` and invalidate the `['notes']` query on success.

    The `QueryClientProvider` is already in `App.tsx`.
  checks:
    loads: The two notes are loaded
    adds: A new note appears after saving
    uses-query: "`useQuery`, `useMutation`, and `invalidateQueries` instead of `useEffect`"
---

# TanStack Query

Server data is different from regular state: it belongs to the server, it can go stale, and many components need it. **TanStack Query** (formerly React Query) takes care of loading, caching, refetching, and errors – you only describe *what* you need.

## Setup

```bash
npm install @tanstack/react-query
```

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}
```

## Fetching Data with useQuery

```tsx
import { useQuery } from '@tanstack/react-query';

function Todos() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isPending) return <p>Loading …</p>;
  if (isError) return <p role="alert">{error.message}</p>;
  return <ul>{data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>;
}
```

- **`queryKey`** identifies the data in the cache. Components with the same key share one request and one result. If the request depends on values, they belong in the key: `['todo', id]`.
- **`queryFn`** is a function that returns a promise – e.g. a `fetch`.

That takes care of race conditions, caching, and loading states. On top of that, TanStack Query automatically refetches data when it's stale – for example when you return to the browser tab. You control how long data counts as fresh with `staleTime`.

## Changing Data with useMutation

```tsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});

<button onClick={() => mutation.mutate('New task')} disabled={mutation.isPending}>
  Add
</button>
```

`invalidateQueries` marks the list as stale – it gets refetched, and all components that display it update.

## When to Use What

| Situation | Tool |
|---|---|
| Server data in a client app | TanStack Query |
| Data in a framework (Next.js, React Router) | its loaders or Server Components |
| A single, simple request | `fetch` in an effect with cleanup |
| UI state (open/closed, input values) | `useState` / `useReducer` |

::tryit{tanstack-query}

> [!TIP]
> The **TanStack Query Devtools** (`@tanstack/react-query-devtools`) show you in the browser which queries are in the cache, whether they are fresh or stale, and when they get refetched.
