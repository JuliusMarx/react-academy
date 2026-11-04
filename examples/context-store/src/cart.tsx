import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';

export type CartItem = { id: number; name: string; quantity: number };
type Action = { type: 'added'; id: number; name: string } | { type: 'removed'; id: number };

function cartReducer(cart: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'added': {
      const existing = cart.find((i) => i.id === action.id);
      if (existing) return cart.map((i) => (i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...cart, { id: action.id, name: action.name, quantity: 1 }];
    }
    case 'removed':
      return cart.filter((i) => i.id !== action.id);
  }
}

// Two contexts: components that only dispatch don't re-render when the cart changes.
const CartContext = createContext<CartItem[] | null>(null);
const CartDispatchContext = createContext<Dispatch<Action> | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>{children}</CartDispatchContext>
    </CartContext>
  );
}

// Small hooks hide how the state is stored – and fail loudly outside the provider.
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
