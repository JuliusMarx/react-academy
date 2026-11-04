import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router';

const products = [
  { id: 1, name: 'Coffee', price: 3.5 },
  { id: 2, name: 'Tea', price: 2.9 },
  { id: 3, name: 'Cocoa', price: 3.2 },
];

function ProductList() {
  // Search params live in the URL: /products?sort=price
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort');
  const sorted = sort === 'price' ? products.toSorted((a, b) => a.price - b.price) : products;

  return (
    <>
      <h2>Products</h2>
      <button onClick={() => setSearchParams({ sort: 'price' })}>Sort by price</button>
      <button onClick={() => setSearchParams({})}>Unsorted</button>
      <ul>
        {sorted.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function ProductPage() {
  const { id } = useParams(); // always a string (or undefined)
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p>Product {id} not found.</p>;
  return (
    <>
      <h2>{product.name}</h2>
      <p>{product.price.toFixed(2)} €</p>
      <button onClick={() => navigate(-1)}>Back</button>
      <button onClick={() => navigate('/products')}>All products</button>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
