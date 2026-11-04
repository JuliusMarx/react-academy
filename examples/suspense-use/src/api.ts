export type User = { id: number; name: string };

const users: Record<number, string> = { 1: 'Ada Lovelace', 2: 'Linus Torvalds', 3: 'Grace Hopper' };

// The promise for each user is created once and then reused – use() needs a stable promise.
const cache = new Map<number, Promise<User>>();

export function getUser(id: number): Promise<User> {
  if (!cache.has(id)) {
    cache.set(
      id,
      new Promise((resolve) => setTimeout(() => resolve({ id, name: users[id] }), 800)),
    );
  }
  return cache.get(id)!;
}
