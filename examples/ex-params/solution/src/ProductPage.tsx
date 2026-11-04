import { useNavigate, useParams } from 'react-router';
import { products } from './products';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p id="not-found">Product not found</p>;

  return (
    <article>
      <h2 id="name">{product.name}</h2>
      <p id="price">{product.price.toFixed(2)} €</p>
      <button onClick={() => navigate('/')}>Back to list</button>
    </article>
  );
}
