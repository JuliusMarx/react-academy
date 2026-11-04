// A fake server – you don't need to change this file.
export async function postComment(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 400));
  return text;
}
