---
title: use() and Suspense
minutes: 8
quiz:
  - question: "What happens when a component calls `use(promise)` and the promise hasn't resolved yet?"
    options: ["It returns `undefined`", "It 'suspends' – the nearest `<Suspense>` boundary shows its fallback", "It throws an error that crashes the app", "It blocks and waits"]
    answer: 1
  - question: "Why must the promise passed to `use()` not be created anew on every render?"
    options: ["Because promises are expensive", "Because every new promise suspends again – the component would never finish", "Because `use()` only accepts strings", "It can be"]
    answer: 1
    explanation: "The promise must be cached, e.g. in a module cache, a library, or a Server Component."
  - question: "How do you prevent the fallback from appearing again when switching to new data?"
    options: ["With `startTransition` or `useTransition`", "With `useEffect`", "With `memo`", "You can't"]
    answer: 0
exercise:
  example: ex-suspense
  title: Loading a Book with Suspense
  task: |-
    1. Read the book in `BookDetails` with `use(bookPromise)` and show the title in `#book`.
    2. Wrap `BookDetails` in `<Suspense>` with the fallback `<p id="fallback">Loading book …</p>`.

    `getBook` already caches the promises – you can call it directly during render.
  checks:
    shows-book: The first book (**Dune**) appears
    shows-fallback: On switching, the fallback appears, then **Foundation**
    uses-use: "It reads with `use()` inside `<Suspense>`, without `useEffect`"
---

# use() and Suspense

With **Suspense**, you describe loading states declaratively: a component says "I'm still waiting", and a surrounding `<Suspense>` boundary shows a placeholder in the meantime.

## Suspense

```tsx
import { Suspense } from 'react';

<Suspense fallback={<p>Loading …</p>}>
  <Profile userPromise={userPromise} />
</Suspense>
```

As long as any component inside the boundary is still waiting, React shows the `fallback`. Once all of them are ready, the content appears all at once. You can nest boundaries to load parts of the page independently of each other.

## use()

With **`use`**, a component reads the value of a promise. If it hasn't resolved yet, the component **suspends**:

```tsx
import { use } from 'react';

function Profile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);
  return <h2>{user.name}</h2>;
}
```

No loading state, no effect, no state: the component only describes the finished state. If the promise is rejected, the error goes to the nearest **error boundary** (next lesson).

> [!WARNING]
> Don't create the promise in the same component (`use(fetch(…))`). Every render would create a new promise, and the component would suspend endlessly. The promise must be **cached**: in a module cache as in the example, in a library, or as a prop from a Server Component.

`use` is special: unlike other Hooks, it can also be called inside `if` blocks and loops. It can also read context: `use(ThemeContext)`.

## Transitions: Keeping the Old Content

When you switch to data that is still loading, React replaces the visible content with the fallback again. Often it's nicer to keep the old content on screen until the new content is ready. To do that, you mark the update as a **transition**:

```tsx
const [isPending, startTransition] = useTransition();

<button onClick={() => startTransition(() => setUserId(2))}>Next</button>
{isPending && <Spinner />}
```

::tryit{suspense-use}

> [!NOTE]
> Where do cached promises come from in practice? Frameworks like Next.js pass them in from Server Components, and libraries like TanStack Query offer their own Suspense hooks (`useSuspenseQuery`).
