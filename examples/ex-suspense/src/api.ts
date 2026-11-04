// A fake server – you don't need to change this file.
export type Book = { id: number; title: string };

const titles: Record<number, string> = { 1: 'Dune', 2: 'Neuromancer', 3: 'Foundation' };
const cache = new Map<number, Promise<Book>>();

/** Returns the same promise for the same id – so it can be passed to use() during rendering. */
export function getBook(id: number): Promise<Book> {
  if (!cache.has(id)) {
    cache.set(id, new Promise((resolve) => setTimeout(() => resolve({ id, title: titles[id] }), 500)));
  }
  return cache.get(id)!;
}
