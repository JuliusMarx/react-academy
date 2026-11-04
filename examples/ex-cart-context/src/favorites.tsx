import { createContext, type ReactNode } from 'react';

// TODO 1: FavoritesProvider keeps a list of favorite ids in state (useState is enough) and provides
//         { favorites, toggle } via FavoritesContext. toggle(id) adds the id or removes it if present.
// TODO 2: useFavorites() reads the context. Outside the provider it throws
//         new Error('useFavorites must be used inside <FavoritesProvider>').
type FavoritesValue = { favorites: number[]; toggle: (id: number) => void };

export const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useFavorites(): FavoritesValue {
  return { favorites: [], toggle: () => {} };
}
