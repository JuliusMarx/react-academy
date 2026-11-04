import type { Check } from './check-kit';
import { cartReducer, type CartItem } from '../cartReducer';

export const exercise = 'ex-reducer';

const coffee = { id: 1, name: 'Coffee', price: 3.5 };
const tea = { id: 2, name: 'Tea', price: 2.9 };

export const checks: Check[] = [
  {
    id: 'adds-new',
    run: (t) => {
      const next = cartReducer([], { type: 'added', product: coffee });
      t.expect(next.length === 1 && next[0].quantity === 1, `Adding Coffee to an empty cart should give [1 × Coffee], got ${JSON.stringify(next)}`);
    },
  },
  {
    id: 'increments',
    run: (t) => {
      const cart: CartItem[] = [{ ...coffee, quantity: 1 }];
      const next = cartReducer(cart, { type: 'added', product: coffee });
      t.expect(next.length === 1 && next[0].quantity === 2, `Adding Coffee again should give [2 × Coffee], got ${JSON.stringify(next)}`);
      t.expect(cart[0].quantity === 1, 'The reducer changed the old state – create new objects instead');
    },
  },
  {
    id: 'removes-and-clears',
    run: (t) => {
      const cart: CartItem[] = [{ ...coffee, quantity: 2 }, { ...tea, quantity: 1 }];
      const removed = cartReducer(cart, { type: 'removed', id: 1 });
      t.expect(removed.length === 1 && removed[0].id === 2, `Removing Coffee should leave only Tea, got ${JSON.stringify(removed)}`);
      t.expect(cart.length === 2, 'The reducer changed the old state – return a new array');
      t.expect(cartReducer(cart, { type: 'cleared' }).length === 0, '"cleared" should return an empty cart');
    },
  },
  {
    id: 'app-total',
    run: async (t) => {
      await t.click(t.button('Add Coffee'));
      await t.click(t.button('Add Coffee'));
      await t.click(t.button('Add Tea'));
      t.expectText('#total', '9.90');
      await t.click(t.button('Clear cart'));
      t.expectText('#total', '0.00');
    },
  },
];
