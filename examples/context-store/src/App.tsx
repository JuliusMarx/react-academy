import { CartProvider, useCart, useCartDispatch } from './cart';

const products = [
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Tea' },
];

function Header() {
  const cart = useCart();
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  return <header>🛒 {count} items</header>;
}

function ProductList() {
  const dispatch = useCartDispatch();
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.name} <button onClick={() => dispatch({ type: 'added', id: p.id, name: p.name })}>Add</button>
        </li>
      ))}
    </ul>
  );
}

function CartView() {
  const cart = useCart();
  const dispatch = useCartDispatch();
  if (cart.length === 0) return <p>The cart is empty.</p>;
  return (
    <ul>
      {cart.map((i) => (
        <li key={i.id}>
          {i.quantity} × {i.name} <button onClick={() => dispatch({ type: 'removed', id: i.id })}>Remove</button>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Header />
      <h2>Products</h2>
      <ProductList />
      <h2>Cart</h2>
      <CartView />
    </CartProvider>
  );
}
