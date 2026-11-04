---
title: TanStack Query
minutes: 9
quiz:
  - question: "Wozu dient der `queryKey`?"
    options: ["Er ist die URL der Anfrage","Er sortiert die Ergebnisse","Er ist ein API-Schlüssel","Er identifiziert die Daten im Cache – gleiche Keys teilen sich dieselben Daten"]
    answer: 3
  - question: "Nach dem Speichern eines neuen Eintrags soll die Liste neu geladen werden. Was rufst du auf?"
    options: ["`queryClient.invalidateQueries({ queryKey: ['todos'] })`","`window.location.reload()`","`useQuery` noch einmal","`setTodos`"]
    answer: 0
  - question: "Was brauchst du, damit `useQuery` funktioniert?"
    options: ["Einen eigenen Server","Einen `QueryClientProvider` mit einem `QueryClient` weiter oben im Baum","Redux","Nichts"]
    answer: 1
exercise:
  example: ex-query
  title: Notizen mit TanStack Query
  task: |-
    `Notes` lädt die Notizen per Effekt. Neue Notizen werden zwar gespeichert, erscheinen aber nicht.

    1. Ersetze State und Effekt durch `useQuery({ queryKey: ['notes'], queryFn: fetchNotes })`. Zeige währenddessen `<p id="loading">Loading …</p>`.
    2. Speichere mit `useMutation({ mutationFn: addNote, … })` und invalidiere bei Erfolg die Query `['notes']`.

    Der `QueryClientProvider` steht schon in `App.tsx`.
  checks:
    loads: Die zwei Notizen werden geladen
    adds: Eine neue Notiz erscheint nach dem Speichern
    uses-query: "`useQuery`, `useMutation` und `invalidateQueries` statt `useEffect`"
---

# TanStack Query

Serverdaten sind anders als normaler State: Sie gehören dem Server, können veralten und werden von vielen Komponenten gebraucht. **TanStack Query** (früher React Query) kümmert sich um Laden, Caching, erneutes Laden und Fehler – du beschreibst nur, *was* du brauchst.

## Einrichten

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

## Daten laden mit useQuery

```tsx
import { useQuery } from '@tanstack/react-query';

function Todos() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isPending) return <p>Lädt …</p>;
  if (isError) return <p role="alert">{error.message}</p>;
  return <ul>{data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>;
}
```

- **`queryKey`** identifiziert die Daten im Cache. Komponenten mit demselben Key teilen sich eine Anfrage und ein Ergebnis. Hängt die Anfrage von Werten ab, gehören sie in den Key: `['todo', id]`.
- **`queryFn`** ist eine Funktion, die ein Promise liefert – z. B. ein `fetch`.

Race Conditions, Caching und Ladezustände sind damit erledigt. Dazu lädt TanStack Query Daten automatisch neu, wenn sie veraltet sind – etwa wenn du zum Browser-Tab zurückkehrst. Wie lange Daten als frisch gelten, steuerst du mit `staleTime`.

## Daten ändern mit useMutation

```tsx
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
});

<button onClick={() => mutation.mutate('Neue Aufgabe')} disabled={mutation.isPending}>
  Hinzufügen
</button>
```

`invalidateQueries` markiert die Liste als veraltet – sie wird neu geladen, und alle Komponenten, die sie anzeigen, aktualisieren sich.

## Wann was?

| Situation | Werkzeug |
|---|---|
| Daten vom Server in einer Client-App | TanStack Query |
| Daten in einem Framework (Next.js, React Router) | dessen Loader bzw. Server Components |
| Ein einzelner, einfacher Abruf | `fetch` im Effekt mit Cleanup |
| UI-Zustand (offen/zu, Eingaben) | `useState` / `useReducer` |

::tryit{tanstack-query}

> [!TIP]
> Die **TanStack Query Devtools** (`@tanstack/react-query-devtools`) zeigen dir im Browser, welche Queries im Cache liegen, ob sie frisch oder veraltet sind und wann sie neu geladen werden.
