import styles from './Button.module.css';

export default function Button({ variant = 'primary', children }: { variant?: 'primary' | 'secondary'; children: string }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      <span className={styles.title}>{children}</span>
    </button>
  );
}
