import type { ReactNode } from 'react';
import './Card.css';

// TODO: the global classes .card and .title clash with legacy.css (pink background, dashed border).
//   1. Rename Card.css to Card.module.css
//   2. import styles from './Card.module.css'
//   3. use className={styles.card} and className={styles.title}
export default function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card">
      <h2 className="title">{title}</h2>
      {children}
    </section>
  );
}
