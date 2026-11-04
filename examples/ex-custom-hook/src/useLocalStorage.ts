import { useState } from 'react';

// TODO: works like useState, but remembers the value in localStorage under "key":
//  1. Start with the stored value (JSON.parse) if there is one, otherwise with initialValue.
//     Tip: pass a function to useState, so localStorage is only read on the first render.
//  2. Whenever the value (or the key) changes, store it with JSON.stringify – in an effect.
export function useLocalStorage<T>(key: string, initialValue: T) {
  void key;
  const [value, setValue] = useState<T>(initialValue);
  return [value, setValue] as const;
}
