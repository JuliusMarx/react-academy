import { useReducer } from 'react';
import { cartReducer } from './cartReducer';

const products = [
  { id: 1, name: 'Coffee', price: 3.5 },
  { id: 2, name: 'Tea', price: 2.9 },
];

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main>
      <h1>Shop</h1>
      {products.map((p) => (
        <button key={p.id} onClick={() => dispatch({ type: 'added', product: p })}>
          Add {p.name}
        </button>
      ))}
      <ul id="cart">
        {cart.map((item) => (
          <li key={item.id}>
            {item.quantity} × {item.name}{' '}
            <button onClick={() => dispatch({ type: 'removed', id: item.id })}>Remove</button>
          </li>
        ))}
      </ul>
      <p>
        Total: <output id="total">{total.toFixed(2)}</output> €
      </p>
      <button onClick={() => dispatch({ type: 'cleared' })}>Clear cart</button>
    </main>
  );
}
