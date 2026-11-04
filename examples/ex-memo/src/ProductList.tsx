// Counts how often ProductList renders – the checks read it. You don't need to change this file
// (except wrapping the component in memo).
export const renders = { count: 0 };

type Product = { id: number; name: string };

// TODO 1: wrap the component in memo(), so it skips rendering when its props are unchanged.
export default function ProductList({ products, onSelect }: { products: Product[]; onSelect: (id: number) => void }) {
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
}
