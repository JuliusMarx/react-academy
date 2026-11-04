import { memo } from 'react';

export const renders = { count: 0 };

type Product = { id: number; name: string };

const ProductList = memo(function ProductList({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (id: number) => void;
}) {
  renders.count++;
  return (
    <ul id="products">
      {products.map((p) => (
        <li key={p.id}>
          <button onClick={() => onSelect(p.id)}>{p.name}</button>
        </li>
      ))}
    </ul>
  );
});

export default ProductList;
