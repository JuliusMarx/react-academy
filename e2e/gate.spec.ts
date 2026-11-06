import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { access } from './access';

test('every page starts behind the access-code gate', async ({ page }) => {
  await page.goto('/de/');
  const field = page.getByLabel('Zugangscode / Access code');
  await expect(field).toBeVisible();
  await expect(page.locator('app-root')).toBeHidden();

  await field.fill('definitely-wrong');
  await page.getByRole('button', { name: 'Weiter / Continue' }).click();
  await expect(page.getByRole('alert')).toHaveText('Falscher Code. / Wrong code.');
  await expect(page.locator('app-root')).toBeHidden();
});

test('the gate has no axe violations', async ({ page }) => {
  await page.goto('/de/');
  await expect(page.getByLabel('Zugangscode / Access code')).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test('an access code is set', () => {
  expect(access.hash, 'Run "npm run access-code" to set the code before deploying.').toMatch(/^[0-9a-f]{64}$/);
});
