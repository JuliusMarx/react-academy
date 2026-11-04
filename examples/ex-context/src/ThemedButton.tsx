import type { ReactNode } from 'react';
import type { Theme } from './theme';

// TODO 1: don't take the theme as a prop – read it from ThemeContext with useContext.
export default function ThemedButton({ theme = 'light', children }: { theme?: Theme; children: ReactNode }) {
  return <button className={`themed ${theme}`}>{children}</button>;
}
