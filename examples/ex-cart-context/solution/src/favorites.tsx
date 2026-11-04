import { createContext, useContext, useState, type ReactNode } from 'react';

type FavoritesValue = { favorites: number[]; toggle: (id: number) => void };

export const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  function toggle(id: number) {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }

  return <FavoritesContext value={{ favorites, toggle }}>{children}</FavoritesContext>;
}

export function useFavorites(): FavoritesValue {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return value;
}
