// A fake server – you don't need to change this file.
export async function subscribe(email: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  if (!email.includes('@')) throw new Error('Invalid email');
}
