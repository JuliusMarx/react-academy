import { products } from './products';

// TODO 1: read the id from the URL with useParams() and show that product (not always the first one)
// TODO 2: for an unknown id, show <p id="not-found">Product not found</p>
// TODO 3: the "Back to list" button navigates to "/" with useNavigate()
export default function ProductPage() {
  const product = products[0];

  return (
    <article>
      <h2 id="name">{product.name}</h2>
      <p id="price">{product.price.toFixed(2)} €</p>
      <button>Back to list</button>
    </article>
  );
}
