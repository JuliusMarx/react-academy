// A fake server – you don't need to change this file.
// Each user takes a different time to load, so requests can overtake each other.
export type User = { id: number; name: string };

const users: Record<number, string> = { 1: 'Ada Lovelace', 2: 'Linus Torvalds', 3: 'Grace Hopper' };
const delays: Record<number, number> = { 1: 700, 2: 100, 3: 400, 4: 200 };

export function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (users[id]) resolve({ id, name: users[id] });
      else reject(new Error('User not found'));
    }, delays[id] ?? 300),
  );
}
