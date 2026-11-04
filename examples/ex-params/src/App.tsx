import { BrowserRouter, Link, Route, Routes } from 'react-router';
import ProductPage from './ProductPage';
import { products } from './products';

function ProductList() {
  return (
    <ul id="list">
      {products.map((p) => (
        <li key={p.id}>
          <Link to={`/products/${p.id}`}>{p.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <h1>Shop</h1>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
