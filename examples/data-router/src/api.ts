export type User = { id: number; name: string };

const users: User[] = [
  { id: 1, name: 'Ada Lovelace' },
  { id: 2, name: 'Grace Hopper' },
];
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getUsers() {
  await wait(400);
  return users;
}

export async function getUser(id: number) {
  await wait(400);
  return users.find((u) => u.id === id) ?? null;
}
