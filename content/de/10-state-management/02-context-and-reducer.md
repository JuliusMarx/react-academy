---
title: Context und Reducer
minutes: 8
quiz:
  - question: "Warum teilt man State und `dispatch` oft auf zwei Contexts auf?"
    options: ["Komponenten, die nur `dispatch` brauchen, rendern dann nicht neu, wenn sich der State ändert","Das ist Pflicht","Weil `dispatch` sonst nicht funktioniert","Wegen TypeScript"]
    answer: 0
  - question: "Was sollte `useCart()` tun, wenn es außerhalb von `<CartProvider>` aufgerufen wird?"
    options: ["Still `null` zurückgeben", "Einen verständlichen Fehler werfen", "Einen neuen Provider anlegen", "Die Seite neu laden"]
    answer: 1
    explanation: "Ein klarer Fehler zeigt sofort, dass der Provider fehlt – statt später an einer ganz anderen Stelle mit `Cannot read properties of null` abzustürzen."
exercise:
  example: ex-cart-context
  title: Favoriten für die ganze App
  task: |-
    Header und Rezeptliste sollen dieselben Favoriten teilen.

    1. `FavoritesProvider` hält eine Liste von IDs im State und stellt `{ favorites, toggle }` über `FavoritesContext` bereit. `toggle(id)` fügt die ID hinzu oder entfernt sie, wenn sie schon drin ist.
    2. `useFavorites()` liest den Context. Außerhalb des Providers wirft es `new Error('useFavorites must be used inside <FavoritesProvider>')`.
  checks:
    shared-state: Speichern in der Liste aktualisiert den Zähler im Header
    toggles: Ein zweiter Klick entfernt den Favoriten wieder
    outside-provider: "`useFavorites()` ohne Provider wirft einen verständlichen Fehler"
---

# Context und Reducer

Für App-weiten State brauchst du nicht unbedingt eine Bibliothek. **Context** und **`useReducer`** zusammen ergeben einen kleinen Store – nur mit Bordmitteln.

## Das Muster

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

1. Der **Reducer** enthält die gesamte Logik (Kapitel 5).
2. Der **Provider** hält den State und stellt ihn bereit.
3. Zwei **Contexts** trennen Lesen und Schreiben: Ein Button, der nur `dispatch` braucht, rendert nicht neu, wenn sich der Warenkorb ändert – `dispatch` bleibt ja immer gleich.

## Eigene Hooks als Schnittstelle

Statt `useContext(CartContext)` überall zu verteilen, bietest du kleine Hooks an:

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

So muss niemand wissen, wie der State intern aufgebaut ist. Und fehlt der Provider, sagt die Fehlermeldung genau, was zu tun ist. Als Standardwert für `createContext` nimmst du dafür `null`.

## Verwenden

```tsx
function Header() {
  const cart = useCart();
  return <header>🛒 {cart.length}</header>;
}

function AddButton({ product }: { product: Product }) {
  const dispatch = useCartDispatch();
  return <button onClick={() => dispatch({ type: 'added', id: product.id })}>In den Warenkorb</button>;
}

<CartProvider>
  <Header />
  <ProductList />
</CartProvider>
```

## Grenzen

Jede Änderung am Warenkorb rendert **alle** Komponenten neu, die `useCart()` aufrufen – auch die, die nur die Anzahl anzeigen. Für einen Warenkorb ist das kein Problem. Wird der State groß und ändert sich häufig, hilft ein Store mit Selektoren.

::tryit{context-store}
