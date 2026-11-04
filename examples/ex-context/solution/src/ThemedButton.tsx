import { useContext, type ReactNode } from 'react';
import { ThemeContext } from './theme';

export default function ThemedButton({ children }: { children: ReactNode }) {
  const theme = useContext(ThemeContext);
  return <button className={`themed ${theme}`}>{children}</button>;
}
