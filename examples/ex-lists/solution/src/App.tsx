import { useState } from 'react';

type Product = { id: number; name: string; price: number; inStock: boolean };

const initialProducts: Product[] = [
  { id: 1, name: 'Coffee', price: 3.5, inStock: true },
  { id: 2, name: 'Tea', price: 2.9, inStock: false },
  { id: 3, name: 'Cocoa', price: 3.2, inStock: true },
];

export default function App() {
  const [products, setProducts] = useState(initialProducts);

  return (
    <main>
      <h1>Products</h1>
      <button onClick={() => setProducts([])}>Clear</button>

      {products.length === 0 ? (
        <p id="empty">No products</p>
      ) : (
        <ul id="products">
          {products.map((product) => (
            <li key={product.id}>
              {product.name} – {product.price.toFixed(2)} €{' '}
              {!product.inStock && <span className="sold-out">sold out</span>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
