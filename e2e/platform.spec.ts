import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { curriculum } from '../src/app/content/generated/curriculum';
import placement from '../src/app/content/generated/placement/de';
import quizzes from '../src/app/content/generated/quizzes/de';

// Everything is derived from the generated content, so the tests work for every Academy fork.
const chapters = curriculum.de;
const lessons = chapters.flatMap((c) => c.lessons.map((l) => ({ ...l, chapter: c.slug })));
const first = lessons[0];
const firstUrl = `/de/${first.chapter}/${first.slug}`;

/** The stored progress, whatever the fork calls its storage key. */
async function storedProgress(page: Page) {
  return page.evaluate(() => {
    const key = Object.keys(localStorage).find((k) => k.endsWith('.progress'));
    return key ? JSON.parse(localStorage.getItem(key)!) : null;
  });
}

test('the course mode chosen on the home page applies to lessons and is remembered', async ({ page }) => {
  await page.goto('/de/');
  await page.getByText('Kurzkurs', { exact: true }).click();

  await page.goto(firstUrl);
  const summary = page.getByRole('region', { name: 'Kurzfassung' });
  await expect(summary).toBeVisible();

  await page.reload();
  await expect(summary).toBeVisible();

  await page.getByRole('button', { name: 'Ausführlich' }).click();
  await expect(summary).toBeHidden();
});

test('wrong quiz answers go into the review queue', async ({ page }) => {
  const quiz = quizzes[first.id];
  await page.goto(firstUrl);

  const questions = page.locator('.quiz fieldset');
  for (const [i, q] of quiz.entries()) {
    await questions.nth(i).getByRole('radio').nth((q.answer + 1) % q.options.length).check();
  }
  await page.getByRole('button', { name: 'Antworten prüfen' }).click();
  await expect(page.getByText(`0 von ${quiz.length} richtig`)).toBeVisible();

  const progress = await storedProgress(page);
  expect(Object.keys(progress.review)).toEqual(quiz.map((_, i) => `${first.id}#${i}`));

  // The questions are due tomorrow, but can be practised right away.
  await page.locator('.review-hint').getByRole('link', { name: 'Wiederholen' }).click();
  await expect(page.getByText('Gerade ist nichts fällig.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Trotzdem jetzt üben' }).click();

  await expect(page.getByText(`Frage 1 von ${quiz.length}`)).toBeVisible();
  await expect(page.getByRole('main').getByRole('heading', { level: 2 })).toBeFocused();
  await page.getByRole('main').getByRole('radio').nth(quiz[0].answer).check();
  await page.getByRole('button', { name: 'Prüfen' }).click();
  await expect(page.getByText('Richtig.')).toBeVisible();

  const after = await storedProgress(page);
  expect(after.review[`${first.id}#0`].box).toBe(1);
});

test('the placement test marks known chapters as done', async ({ page }) => {
  await page.goto('/de/placement');
  await page.locator('fieldset.question').first().getByRole('radio').nth(placement[0].question.answer).check();
  await page.getByRole('button', { name: 'Auswerten' }).click();

  await expect(page.getByRole('heading', { name: `Du kennst dich schon in 1 von ${chapters.length} Kapiteln aus.` })).toBeFocused();
  await page.getByRole('button', { name: /als erledigt markieren/ }).click();
  await expect(page.getByText(/als erledigt markiert/)).toBeVisible();

  const progress = await storedProgress(page);
  expect(progress.completedLessons).toEqual(chapters[0].lessons.map((l) => l.id));
  // "Continue" on the home page leads to the first chapter that is left.
  expect(progress.lastLesson).toBe(chapters[1].lessons[0].id);
});

test('search finds lessons and opens them', async ({ page }) => {
  const target = lessons[3];
  await page.goto('/de/');
  const field = page.getByRole('combobox', { name: 'Suchen' });
  // The shortcut only works once the prerendered page is hydrated, so retry until the dialog opens.
  await expect(async () => {
    await page.keyboard.press('Control+k');
    await expect(field).toBeVisible({ timeout: 1000 });
  }).toPass();
  await field.fill(target.title);
  await page.getByRole('option').first().click();
  await expect(page).toHaveURL(new RegExp(`/de/${target.chapter}/${target.slug}`));
});

test('the language switch keeps the current page', async ({ page }) => {
  await page.goto(firstUrl);
  await page.getByRole('navigation', { name: 'Sprache' }).getByRole('link', { name: 'EN' }).click();
  await expect(page).toHaveURL(new RegExp(`/en/${first.chapter}/${first.slug}`));
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('the cheat sheet lists every lesson and the certificate needs all of them', async ({ page }) => {
  await page.goto('/de/cheatsheet');
  await expect(page.locator('article.lesson')).toHaveCount(lessons.length);

  await page.goto('/de/certificate');
  await expect(page.getByText(`Erledigt hast du 0 von ${lessons.length}.`, { exact: false })).toBeVisible();
});

test.describe('accessibility', () => {
  const pages = ['/de/', firstUrl, '/de/placement', '/de/review', '/de/cheatsheet', '/de/certificate', '/en/'];
  for (const colorScheme of ['light', 'dark'] as const) {
    for (const path of pages) {
      test(`${path} has no axe violations (${colorScheme})`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.goto(path);
        await expect(page.locator('main h1:visible').first()).toBeVisible();
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze();
        expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
      });
    }
  }
});
