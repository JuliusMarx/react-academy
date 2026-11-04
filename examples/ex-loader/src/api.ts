// A fake server – you don't need to change this file.
export type Recipe = { id: number; title: string; minutes: number };

const recipes: Recipe[] = [
  { id: 1, title: 'Pancakes', minutes: 20 },
  { id: 2, title: 'Risotto', minutes: 40 },
];

export async function getRecipe(id: number): Promise<Recipe | null> {
  await new Promise((r) => setTimeout(r, 200));
  return recipes.find((r) => r.id === id) ?? null;
}
