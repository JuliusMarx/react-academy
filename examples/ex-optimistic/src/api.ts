// A fake server – you don't need to change this file.
export type Todo = { id: number; title: string };

let nextId = 2;

export async function saveTodo(title: string): Promise<Todo> {
  await new Promise((r) => setTimeout(r, 600));
  if (title.toLowerCase().includes('fail')) throw new Error('Saving failed');
  return { id: nextId++, title };
}
