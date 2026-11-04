import { useState } from 'react';

type Product = { id: number; name: string; price: number; inStock: boolean };

const initialProducts: Product[] = [
  { id: 1, name: 'Coffee', price: 3.5, inStock: true },
  { id: 2, name: 'Tea', price: 2.9, inStock: false },
  { id: 3, name: 'Cocoa', price: 3.2, inStock: true },
];

export default function App() {
  // You'll learn about useState in chapter 3 – here it only lets the Clear button empty the list.
  const [products, setProducts] = useState(initialProducts);

  return (
    <main>
      <h1>Products</h1>
      <button onClick={() => setProducts([])}>Clear</button>

      {/* TODO 1: one <li> per product with its name and price, e.g. "Coffee – 3.50 €" (don't forget the key) */}
      {/* TODO 2: products that are not in stock additionally show <span className="sold-out">sold out</span> */}
      <ul id="products"></ul>

      {/* TODO 3: if there are no products, show <p id="empty">No products</p> instead */}
      {void products}
    </main>
  );
}
