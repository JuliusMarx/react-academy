export type CartItem = { id: number; name: string; price: number; quantity: number };

export type CartAction =
  | { type: 'added'; product: { id: number; name: string; price: number } }
  | { type: 'removed'; id: number }
  | { type: 'cleared' };

export function cartReducer(cart: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'added': {
      const existing = cart.find((item) => item.id === action.product.id);
      if (existing) {
        return cart.map((item) => (item.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...cart, { ...action.product, quantity: 1 }];
    }
    case 'removed':
      return cart.filter((item) => item.id !== action.id);
    case 'cleared':
      return [];
  }
}
