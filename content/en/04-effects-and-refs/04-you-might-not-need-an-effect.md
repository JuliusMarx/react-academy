---
title: You Might Not Need an Effect
minutes: 8
quiz:
  - question: "You want to build a filtered list from `items` and `query`. What is the best way?"
    options: ["With `useState` and a `useEffect` that updates the list", "Calculate it directly during rendering: `const visible = items.filter(…)`", "Store it in a ref", "Save it in `localStorage`"]
    answer: 1
  - question: "How do you reset all of a component's state when `userId` changes?"
    options: ["With an Effect that resets every piece of state", "With `key={userId}` on the component", "With `window.location.reload()`", "You can't"]
    answer: 1
    explanation: "A different `key` means a new component to React – the state starts from scratch."
  - question: "After a click on Buy, a notification should appear. Where does the code belong?"
    options: ["In an Effect that reacts to the cart", "In the button's event handler", "In the component directly during rendering", "In `main.tsx`"]
    answer: 1
exercise:
  example: ex-no-effect
  title: Remove the Effect
  task: |-
    The app copies the filtered list and the summary into separate state using `useEffect`. That is cumbersome – and buggy: new items don't appear because `items` is missing from the dependencies.

    Remove the Effect and the extra state. Calculate `visible` and the summary directly during rendering.
  checks:
    filters: The filter **ap** shows Apple and Grape, "2 of 4 shown"
    new-items: New items appear immediately
    no-effect: "`App.tsx` works without `useEffect` and without extra state"
---

# You Might Not Need an Effect

Effects are an escape hatch from React – for synchronizing with external systems. Many Effects you see in practice are unnecessary: they make code slower, more convoluted, and more error-prone. Here are the most common cases and what to do instead.

## Derive Values Instead of Synchronizing Them

```tsx
// ✗ Unnecessary: extra state plus an Effect
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✓ Simply calculate during rendering
const fullName = `${firstName} ${lastName}`;
```

The Effect version first renders with the old value and then immediately renders again. The calculated version is always up to date – and shorter.

If a calculation is really expensive, remember the result with `useMemo` (Chapter 5) instead of copying it into state.

## Reset State with a key

If a component should start over when something changes, give it a `key`:

```tsx
<Profile key={userId} userId={userId} />
```

When `userId` changes, React recreates `Profile` – along with its state. You don't need an Effect that resets each piece of state individually.

## Events Belong in Event Handlers

```tsx
// ✗ The Effect reacts to the click indirectly
useEffect(() => {
  if (product.isInCart) showNotification(`${product.name} added to cart`);
}, [product]);

// ✓ Right where it happens
function handleBuy() {
  addToCart(product);
  showNotification(`${product.name} added to cart`);
}
```

The question is: *why* should the code run? Because the user did something → event handler. Because the component is displayed and needs to stay in sync with something → Effect.

## Avoid Chains of Effects

Effects that set state, which triggers the next Effect, are hard to follow. Calculate as much as possible during rendering and bundle changes together in the event handler.

## When an Effect Is Right

- Timers, intervals, animations
- Browser APIs such as `resize`, `IntersectionObserver`, `document.title`
- Connections (WebSocket, chat) and subscriptions
- Integrating non-React libraries (maps, charts)

Fetching data is also an Effect – but you will usually use a library or `use()` with Suspense for that. More on this in Chapter 6.

::tryit{no-effect}
