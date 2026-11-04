import type { ReactNode } from 'react';

type ProductCardProps = {
  name: string;
  price: number;
  onSale?: boolean;
};

function ProductCard({ name, price, onSale = false }: ProductCardProps) {
  return (
    <article style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <h2 style={{ margin: 0 }}>{name}</h2>
      <p style={{ margin: 0 }}>
        {price.toFixed(2)} € {onSale && <strong>– on sale!</strong>}
      </p>
    </article>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h1>{title}</h1>
      {children}
    </section>
  );
}

export default function App() {
  return (
    <Panel title="Shop">
      <ProductCard name="Coffee" price={3.5} />
      <ProductCard name="Tea" price={2.9} onSale />
    </Panel>
  );
}
