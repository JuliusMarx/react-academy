import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { curriculum } from '../src/app/content/generated/curriculum';
import placement from '../src/app/content/generated/placement/de';
import quizzes from '../src/app/content/generated/quizzes/de';
import { SITE } from '../src/app/core/site';

// Everything is derived from the generated content, so the tests work for every Academy fork.
const chapters = curriculum.de;
const lessons = chapters.flatMap((c) => c.lessons.map((l) => ({ ...l, chapter: c.slug })));
const first = lessons[0];
const firstUrl = `/de/${first.chapter}/${first.slug}`;
const last = lessons[lessons.length - 1];
const lastUrl = `/de/${last.chapter}/${last.slug}`;


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

test('notes and bookmarks are saved and collected on the notes page', async ({ page }) => {
  await page.goto(firstUrl);
  const main = page.getByRole('main');
  await main.getByRole('button', { name: 'Lektion merken' }).click();
  await expect(main.getByRole('button', { name: 'Gemerkt' })).toHaveAttribute('aria-pressed', 'true');
  await main.getByRole('textbox', { name: 'Deine Notizen zu dieser Lektion' }).fill('Später nochmal lesen');
  await expect(main.getByRole('status').filter({ hasText: 'Gespeichert' })).toBeVisible();

  // Survives a reload …
  await page.reload();
  await expect(main.getByRole('textbox', { name: 'Deine Notizen zu dieser Lektion' })).toHaveValue('Später nochmal lesen');

  // … and shows up on the notes page.
  await page.goto('/de/notes');
  await expect(main.getByRole('heading', { name: 'Lesezeichen', exact: true })).toBeVisible();
  await expect(main.getByRole('listitem').getByRole('link', { name: first.title })).toBeVisible();
  await expect(main.getByText('Später nochmal lesen')).toBeVisible();

  await main.getByRole('button', { name: `„${first.title}“ aus den Lesezeichen entfernen` }).click();
  await expect(main.getByText('Noch keine Lektion gemerkt.', { exact: false })).toBeVisible();
  expect((await storedProgress(page)).bookmarks).toEqual([]);
});

test('the transfer code moves progress and notes to another browser', async ({ page, browser }) => {
  await page.goto(firstUrl);
  await page.getByRole('main').getByRole('textbox', { name: 'Deine Notizen zu dieser Lektion' }).fill('Mitnehmen');
  await page.getByRole('main').getByRole('button', { name: 'Als erledigt markieren' }).click();
  await page.goto('/de/');
  await page.getByText('Fortschritt verwalten').click();
  await page.getByRole('button', { name: 'Code kopieren' }).click();
  const code = await page.getByRole('textbox', { name: 'Dein Übertragungscode' }).inputValue();
  expect(code).toMatch(/^[A-Za-z0-9+/=]+$/);

  // A fresh browser context has no progress yet, so no confirmation is needed.
  const other = await browser.newPage();
  await other.goto('/de/');
  await other.getByText('Fortschritt verwalten').click();
  await other.getByRole('textbox', { name: 'Code vom anderen Gerät' }).fill(code);
  await other.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(other.getByRole('status').filter({ hasText: 'Fortschritt übernommen.' })).toBeVisible();
  const progress = await storedProgress(other);
  expect(progress.completedLessons).toContain(first.id);
  expect(progress.notes[first.id]).toBe('Mitnehmen');
  await other.close();
});

test('the glossary filters terms and links to lessons', async ({ page }) => {
  await page.goto('/de/glossary');
  const main = page.getByRole('main');
  const terms = main.locator('dt');
  const total = await terms.count();
  expect(total).toBeGreaterThan(20);

  await main.getByRole('searchbox', { name: 'Begriff filtern' }).fill('zzzz');
  await expect(main.getByText('Kein Begriff passt zu „zzzz“.')).toBeVisible();
  await expect(terms).toHaveCount(0);

  await main.getByRole('searchbox', { name: 'Begriff filtern' }).fill('');
  await expect(terms).toHaveCount(total);
  const lessonLink = main.locator('dd a').first();
  const title = await lessonLink.textContent();
  await lessonLink.click();
  await expect(page.locator('main h1:visible').first()).toHaveText(title!.trim());
});

test('lessons stay readable offline once the service worker has cached the course', async ({ page, context }) => {
  test.setTimeout(120_000);
  await page.goto(firstUrl);

  // Going offline while the worker is still downloading would abort its installation,
  // so wait until every file of the app group is in its cache.
  await expect
    .poll(
      () =>
        page.evaluate(async () => {
          if (!navigator.serviceWorker.controller) return false;
          const manifest = await fetch('/ngsw.json', { cache: 'no-store' }).then((r) => r.json());
          const app = manifest.assetGroups.find((group: { name: string }) => group.name === 'app');
          const name = (await caches.keys()).find((key) => key.endsWith(':assets:app:cache'));
          return !!name && (await (await caches.open(name)).keys()).length >= app.urls.length;
        }),
      { timeout: 90_000 },
    )
    .toBe(true);

  await context.setOffline(true);
  await page.goto(lastUrl);
  await expect(page.locator('main h1:visible').first()).toHaveText(last.title);
  await context.setOffline(false);
});

test('the account page offers the GitHub sign-in – or explains that accounts are off', async ({ page }) => {
  await page.goto('/de/account');
  const main = page.getByRole('main');
  const nav = page.getByRole('navigation', { name: 'Kursnavigation' });
  await expect(page.locator('main h1:visible').first()).toHaveText('Konto');
  if (SITE.cloud.url) {
    await expect(main.getByRole('button', { name: 'Mit GitHub anmelden' })).toBeVisible();
    await expect(main.getByRole('textbox', { name: 'E-Mail-Adresse' })).toBeVisible();
    await main.getByRole('button', { name: 'Noch kein Konto? Registrieren' }).click();
    await expect(main.getByRole('button', { name: 'Konto erstellen' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Konto' })).toBeVisible();
  } else {
    await expect(main.getByText('Konten sind auf dieser Seite noch nicht eingerichtet.', { exact: false })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Konto' })).toHaveCount(0);
  }
});

test('the admin dashboard is only for admins', async ({ page }) => {
  await page.goto('/de/admin');
  await expect(page.locator('main h1:visible').first()).toHaveText('Dashboard');
  await expect(page.getByText('Diese Seite ist nur für Admins.', { exact: false })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Kursnavigation' }).getByRole('link', { name: 'Admin' })).toHaveCount(0);
});

test.describe('accessibility', () => {
  const pages = ['/de/', firstUrl, lastUrl, '/de/placement', '/de/review', '/de/cheatsheet', '/de/glossary', '/de/notes', '/de/account', '/de/admin', '/de/certificate', '/de/imprint', '/de/privacy', '/en/privacy', '/en/'];
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
