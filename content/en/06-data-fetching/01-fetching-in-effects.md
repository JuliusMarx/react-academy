---
title: Fetching Data in Effects
minutes: 9
quiz:
  - question: "The user quickly switches from profile 1 to profile 2. The response for profile 1 arrives last. What does a component without cleanup show?"
    options: ["Profile 2","Nothing","An error","Profile 1 – the stale response overwrites the current one"]
    answer: 3
    explanation: "This is a race condition. With an `ignore` variable or an `AbortController` in the cleanup function, you discard stale responses."
  - question: "Why do you also check `res.ok` when using `fetch`?"
    options: ["`fetch` doesn't throw on HTTP errors like 404", "Because `res.json()` is slower otherwise", "It isn't necessary", "Only for POST requests"]
    answer: 0
  - question: "What is a drawback of fetching data directly in effects?"
    options: ["It doesn't work with TypeScript", "No caching – every component fetches again, and you have to handle loading states, errors, and race conditions yourself", "Effects can't call `fetch`", "There is none"]
    answer: 1
exercise:
  example: ex-fetch-effect
  title: Loading a Profile
  task: |-
    `Profile` loads a user with `fetchUser`. The responses arrive at different speeds – user 1 takes the longest.

    1. While loading, show `<p id="loading">Loading …</p>` – also when switching to another user.
    2. If `fetchUser` fails, show `<p id="error">` with the error message.
    3. Fix the race condition: if `userId` changes before the old response arrives, ignore it.
  checks:
    loads-user: User 1 is loaded and displayed
    shows-loading: On switching, `#loading` appears instead of the old user
    shows-error: User 4 shows **User not found**
    no-race: After a quick switch 1 → 2, user 2 is displayed
---

# Fetching Data in Effects

The simplest way to get data from the server: a `fetch` in an effect. Along the way you'll meet the problems that every data-fetching solution has to solve – including the libraries you'll use later.

## Loading, Loading State, Error

```tsx
function Profile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(null);
    setError(null);
    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setUser)
      .catch((e) => setError(e.message));
  }, [userId]);

  if (error) return <p role="alert">{error}</p>;
  if (!user) return <p>Loading …</p>;
  return <h2>{user.name}</h2>;
}
```

You have to represent three states: **loading**, **error**, **done**.

> [!WARNING]
> `fetch` does *not* throw on HTTP errors like 404 or 500 – only on network problems. So always check `res.ok`.

> [!NOTE]
> Watch out when testing with the Vite dev server: by default it answers unknown paths with `index.html` and status **200** (SPA fallback). A missing JSON file then doesn't give you a 404 but a parse error. In the example, `appType: 'mpa'` in `vite.config.ts` turns this off.

## Race Conditions

If `userId` quickly changes from 1 to 2, two requests run at the same time. If the response for user 1 arrives *last*, it overwrites the correct user 2. The solution is a cleanup function that discards stale responses:

```tsx
useEffect(() => {
  let ignore = false;
  fetchUser(userId).then((data) => {
    if (!ignore) setUser(data);
  });
  return () => {
    ignore = true; // this effect is outdated
  };
}, [userId]);
```

Alternatively, you can cancel the request entirely with an **`AbortController`**:

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setUser)
    .catch((e) => {
      if (e.name !== 'AbortError') setError(e.message);
    });
  return () => controller.abort();
}, [userId]);
```

## The Limits of This Approach

For small apps, this is enough. For larger ones, quite a bit is missing:

- **No caching**: Every component fetches again, even if the data is already there.
- **Waterfalls**: Children only start their request once the parent has finished loading.
- **Lots of manual work**: loading state, errors, cancellation, refetching – in every component.

That's why real projects usually use a library like **TanStack Query** (lesson 4) or a framework's data-fetching features.

::tryit{fetch-effect}
