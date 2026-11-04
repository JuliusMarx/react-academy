export type CartItem = { id: number; name: string; price: number; quantity: number };

export type CartAction =
  | { type: 'added'; product: { id: number; name: string; price: number } }
  | { type: 'removed'; id: number }
  | { type: 'cleared' };

// TODO: implement the reducer. Never change the existing state – always return a new array.
//  - "added": a new product gets quantity 1; a product that's already in the cart gets quantity + 1
//  - "removed": removes the item with this id completely
//  - "cleared": empties the cart
export function cartReducer(cart: CartItem[], action: CartAction): CartItem[] {
  void action;
  return cart;
}
