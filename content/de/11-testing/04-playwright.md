---
title: UI-Tests mit Playwright
minutes: 7
summary: |-
  - End-to-End-Tests starten die echte App in einem echten Browser und klicken sich durch wie ein Nutzer – Routing, Daten und Formulare zusammen.
  - `npm init playwright@latest` fragt nach dem Testordner (hier `e2e/`), legt `playwright.config.ts` und Beispieltests an und installiert die Browser. Mit `webServer` startet Playwright den Dev-Server selbst.
  - Die Locators `getByRole`, `getByLabel` und `getByText` funktionieren wie in Testing Library.
  - Aktionen warten automatisch, bis das Element bereit ist, und `expect`-Prüfungen wie `toBeVisible()` wiederholen sich, bis sie zutreffen (standardmäßig bis zu 5 Sekunden) – eigene `waitForTimeout`-Pausen brauchst du fast nie.
  - `npx playwright test` läuft in Chromium, Firefox und WebKit; `--ui`, `codegen` und `show-report` helfen beim Schreiben und Auswerten.
  - Schreib viele Komponententests und einige End-to-End-Tests für die wichtigsten Abläufe.

  ```ts
  test('neues Todo hinzufügen', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Neues Todo').fill('Playwright lernen');
    await page.getByRole('button', { name: 'Hinzufügen' }).click();
    await expect(page.getByRole('listitem').filter({ hasText: 'Playwright lernen' })).toBeVisible();
  });
  ```

  > [!NOTE] Playwright braucht echte Browser und läuft deshalb nicht im Browser-Editor dieses Kurses, sondern in einem lokalen Projekt.
quiz:
  - question: "Was unterscheidet einen Playwright-Test von einem Komponententest?"
    options: ["Nichts", "Er startet die ganze App in einem echten Browser und klickt sich durch wie ein Nutzer", "Er läuft ohne Browser", "Er testet nur CSS"]
    answer: 1
  - question: "Warum brauchst du in Playwright selten eigene Wartezeiten?"
    options: ["Weil Tests sowieso langsam sind","Weil es keine asynchronen Apps gibt","Weil Aktionen und `expect`-Prüfungen automatisch warten, bis das Element bereit ist","Wegen `setTimeout`"]
    answer: 2
---

# UI-Tests mit Playwright

Komponententests prüfen Bausteine einzeln. **End-to-End-Tests** prüfen das Ganze: Die echte App läuft in einem echten Browser, und ein Test klickt sich durch wie ein Mensch – Routing, Daten, Formulare, alles zusammen. Das verbreitetste Werkzeug dafür ist **Playwright**.

## Einrichten

```bash
npm init playwright@latest
```

Der Assistent fragt nach einem Ordner für die Tests (Standard: `tests/`, hier nehmen wir `e2e/`), legt eine `playwright.config.ts` und Beispieltests an und installiert die Browser. Damit Playwright die App selbst startet, trägst du den Dev-Server ein:

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true },
  // projects: Chromium, Firefox und WebKit – legt der Assistent bereits an
});
```

## Ein Test

```ts
// e2e/todos.spec.ts
import { expect, test } from '@playwright/test';

test('neues Todo hinzufügen', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Neues Todo').fill('Playwright lernen');
  await page.getByRole('button', { name: 'Hinzufügen' }).click();

  await expect(page.getByRole('listitem').filter({ hasText: 'Playwright lernen' })).toBeVisible();
});
```

Die Locators kennst du schon: `getByRole`, `getByLabel` und `getByText` funktionieren wie in Testing Library.

## Automatisches Warten

Playwright wartet bei jeder Aktion, bis das Element sichtbar, aktiv und stabil ist. Auch `expect(…).toBeVisible()` oder `toHaveText()` wiederholen die Prüfung, bis sie zutrifft (standardmäßig bis zu 5 Sekunden). Eigene `waitForTimeout`-Pausen brauchst du deshalb fast nie – sie machen Tests nur langsam und wackelig.

## Ausführen

| Befehl | Wirkung |
|---|---|
| `npx playwright test` | alle Tests in Chromium, Firefox und WebKit |
| `npx playwright test --ui` | interaktive Oberfläche mit Zeitreise durch jeden Schritt |
| `npx playwright codegen localhost:5173` | zeichnet deine Klicks als Testcode auf |
| `npx playwright show-report` | HTML-Bericht mit Screenshots und Traces |

> [!NOTE]
> Playwright braucht echte Browser und läuft deshalb nicht im Browser-Editor dieses Kurses. Probiere es in einem lokalen Vite-Projekt aus.

## Welche Tests wie viele?

- **Viele Komponententests**: schnell, genau, zeigen direkt, wo der Fehler liegt.
- **Einige End-to-End-Tests** für die wichtigsten Abläufe: Anmelden, Bestellen, Speichern.

End-to-End-Tests geben die meiste Sicherheit, sind aber langsamer und aufwändiger zu pflegen. Teste mit ihnen das, was auf keinen Fall kaputtgehen darf.
