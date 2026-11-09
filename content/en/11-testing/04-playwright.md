---
title: UI Tests with Playwright
minutes: 7
summary: |-
  - End-to-end tests run the real app in a real browser and click through it like a user – routing, data and forms all together.
  - `npm init playwright@latest` asks for the test folder (here `e2e/`), creates `playwright.config.ts` and sample tests, and installs the browsers. With `webServer`, Playwright starts the dev server itself.
  - The locators `getByRole`, `getByLabel` and `getByText` work like in Testing Library.
  - Actions wait automatically until the element is ready, and `expect` checks like `toBeVisible()` retry until they pass (up to 5 seconds by default) – you almost never need your own `waitForTimeout` pauses.
  - `npx playwright test` runs in Chromium, Firefox and WebKit; `--ui`, `codegen` and `show-report` help you write and review tests.
  - Write many component tests and a few end-to-end tests for the most important flows.

  ```ts
  test('adds a new todo', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('New todo').fill('Learn Playwright');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('listitem').filter({ hasText: 'Learn Playwright' })).toBeVisible();
  });
  ```

  > [!NOTE] Playwright needs real browsers, so it doesn't run in this course's browser editor – try it in a local project.
quiz:
  - question: "What sets a Playwright test apart from a component test?"
    options: ["Nothing", "It starts the whole app in a real browser and clicks through it like a user", "It runs without a browser", "It only tests CSS"]
    answer: 1
  - question: "Why do you rarely need your own wait times in Playwright?"
    options: ["Because tests are slow anyway","Because there are no asynchronous apps","Because actions and `expect` assertions automatically wait until the element is ready","Because of `setTimeout`"]
    answer: 2
---

# UI Tests with Playwright

Component tests check building blocks individually. **End-to-end tests** check the whole thing: the real app runs in a real browser, and a test clicks through it like a person – routing, data, forms, everything together. The most widely used tool for this is **Playwright**.

## Setup

```bash
npm init playwright@latest
```

The wizard asks for a folder for your tests (default: `tests/`, here we use `e2e/`), creates a `playwright.config.ts` and example tests, and installs the browsers. To have Playwright start the app itself, you register the dev server:

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true },
  // projects: Chromium, Firefox and WebKit – already set up by the wizard
});
```

## A Test

```ts
// e2e/todos.spec.ts
import { expect, test } from '@playwright/test';

test('adds a new todo', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('New todo').fill('Learn Playwright');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByRole('listitem').filter({ hasText: 'Learn Playwright' })).toBeVisible();
});
```

You already know the locators: `getByRole`, `getByLabel` and `getByText` work just like in Testing Library.

## Auto-Waiting

With every action, Playwright waits until the element is visible, enabled and stable. Assertions like `expect(…).toBeVisible()` or `toHaveText()` also retry until they pass (up to 5 seconds by default). That's why you almost never need your own `waitForTimeout` pauses – they only make tests slow and flaky.

## Running Tests

| Command | Effect |
|---|---|
| `npx playwright test` | all tests in Chromium, Firefox and WebKit |
| `npx playwright test --ui` | interactive interface with time travel through every step |
| `npx playwright codegen localhost:5173` | records your clicks as test code |
| `npx playwright show-report` | HTML report with screenshots and traces |

> [!NOTE]
> Playwright needs real browsers and therefore doesn't run in this course's browser editor. Try it in a local Vite project.

## Which Tests, and How Many?

- **Many component tests**: fast, precise, and they show directly where the bug is.
- **A few end-to-end tests** for the most important flows: signing in, ordering, saving.

End-to-end tests give you the most confidence, but they are slower and harder to maintain. Use them to test what must never break.
