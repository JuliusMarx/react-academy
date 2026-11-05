---
title: Context and Reducer
minutes: 8
summary: |-
  - Context plus `useReducer` gives you a small store without a library: the reducer holds the logic, the provider holds the state and provides it.
  - Two contexts separate reading from writing. Components that only need `dispatch` don't re-render when the state changes – `dispatch` never changes.
  - You render the context itself as the provider: `<CartContext value={cart}>`.
  - Custom hooks like `useCart()` and `useCartDispatch()` hide the internal structure. With `null` as the default value they detect a missing provider and throw a clear error.
  - Limit: every change re-renders all components that call `useCart()`. For large, frequently changing state, a store with selectors helps.

  ```tsx
  export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, dispatch] = useReducer(cartReducer, []);
    return (
      <CartContext value={cart}>
        <CartDispatchContext value={dispatch}>{children}</CartDispatchContext>
      </CartContext>
    );
  }

  export function useCart() {
    const cart = useContext(CartContext);
    if (!cart) throw new Error('useCart must be used inside <CartProvider>');
    return cart;
  }
  ```
quiz:
  - question: "Why is state often split from `dispatch` into two contexts?"
    options: ["Components that only need `dispatch` then don't re-render when the state changes","It is required","Because `dispatch` doesn't work otherwise","Because of TypeScript"]
    answer: 0
  - question: "What should `useCart()` do when it is called outside `<CartProvider>`?"
    options: ["Silently return `null`", "Throw a clear error", "Create a new provider", "Reload the page"]
    answer: 1
    explanation: "A clear error immediately shows that the provider is missing – instead of crashing later somewhere else with `Cannot read properties of null`."
exercise:
  example: ex-cart-context
  title: Favorites for the whole app
  task: |-
    The header and the recipe list should share the same favorites.

    1. `FavoritesProvider` keeps a list of IDs in state and provides `{ favorites, toggle }` via `FavoritesContext`. `toggle(id)` adds the ID, or removes it if it is already in the list.
    2. `useFavorites()` reads the context. Outside the provider it throws `new Error('useFavorites must be used inside <FavoritesProvider>')`.
  checks:
    shared-state: Saving in the list updates the counter in the header
    toggles: A second click removes the favorite again
    outside-provider: "`useFavorites()` without a provider throws a clear error"
---

# Context and Reducer

For app-wide state you don't necessarily need a library. **Context** and **`useReducer`** together make a small store – using only what React ships with.

## The pattern

```tsx
// cart.tsx
const CartContext = createContext<CartItem[] | null>(null);
const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>{children}</CartDispatchContext>
    </CartContext>
  );
}
```

1. The **reducer** contains all the logic (chapter 5).
2. The **provider** holds the state and makes it available.
3. Two **contexts** separate reading from writing: a button that only needs `dispatch` doesn't re-render when the cart changes – `dispatch` always stays the same.

## Custom hooks as the interface

Instead of scattering `useContext(CartContext)` everywhere, you offer small hooks:

```tsx
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error('useCart must be used inside <CartProvider>');
  return cart;
}

export function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (!dispatch) throw new Error('useCartDispatch must be used inside <CartProvider>');
  return dispatch;
}
```

This way nobody needs to know how the state is structured internally. And if the provider is missing, the error message says exactly what to do. That is why you use `null` as the default value for `createContext`.

## Using it

```tsx
function Header() {
  const cart = useCart();
  return <header>🛒 {cart.length}</header>;
}

function AddButton({ product }: { product: Product }) {
  const dispatch = useCartDispatch();
  return <button onClick={() => dispatch({ type: 'added', id: product.id })}>Add to cart</button>;
}

<CartProvider>
  <Header />
  <ProductList />
</CartProvider>
```

## Limits

Every change to the cart re-renders **all** components that call `useCart()` – even those that only show the count. For a cart that is no problem. If the state grows large and changes often, a store with selectors helps.

::tryit{context-store}
