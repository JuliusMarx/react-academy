import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';

/** Storage key and code hash of the access gate in src/index.html (tests run from the repo root). */
const html = readFileSync(join(process.cwd(), 'src/index.html'), 'utf8');
const [, key, hash] = html.match(/var ACCESS = \{ key: '([^']+)', hash: '([0-9a-f]*)' \}/) ?? [];
export const access = { key, hash };

/** Stores the unlocked state, as if the visitor had entered the code before. */
export async function unlock(page: Page): Promise<void> {
  await page.addInitScript(({ key, hash }) => localStorage.setItem(key, hash), access);
}
