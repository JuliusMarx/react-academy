# React Academy

Eine interaktive Lernplattform für React, ähnlich wie W3Schools: kurze Lektionen, Codebeispiele zum Ausprobieren direkt im Browser und Quizze mit sofortigem Feedback. Inhalte auf Deutsch und Englisch.

Konzept und Roadmap: [CONCEPT.md](CONCEPT.md)

## Entwicklung

Voraussetzung: Node.js ≥ 24.15 (bzw. ≥ 22.22.3).

```bash
npm install
npm start          # Dev-Server auf http://localhost:4200
npm test           # Unit-Tests (Vitest)
npm run build      # Statischer Build mit vorgerenderten Seiten → dist/react-academy/browser
```

`npm start`, `npm test` und `npm run build` erzeugen vorher automatisch die Inhalte (`npm run content`). Während der Dev-Server läuft, nach Änderungen an `content/` oder `examples/` einfach `npm run content` erneut ausführen.

## Deployment

Die Seite läuft auf Netlify. Die Konfiguration steht in [netlify.toml](netlify.toml): Build-Befehl, Ausgabeordner, Node-Version, Weiterleitungen (Startseite je nach Browsersprache auf `/de` oder `/en`) und Header. Jeder Push auf `main` wird automatisch veröffentlicht, Pull Requests bekommen einen Vorschau-Link.

Lokal testen, inklusive der Netlify-Regeln:

```bash
npm run build
npx netlify-cli dev --offline --dir dist/react-academy/browser
```

## Projektstruktur

```
content/<sprache>/<NN-kapitel>/
  _chapter.md              # Kapitel-Titel und -Beschreibung (Frontmatter)
  <NN-lektion>.md          # Lektion: Markdown + Frontmatter (title, minutes, quiz)
examples/
  _base/                   # Gemeinsames Vite-+-React-Projekt für alle Live-Beispiele
  _exercise-kit/           # Prüf-Kit, das jede Übung zusätzlich bekommt
  <beispiel-id>/           # Dateien, die _base überschreiben/ergänzen (+ optional meta.json)
scripts/build-content.mjs  # Markdown → TypeScript-Module in src/app/content/generated/
src/app/
  content/                 # Datenmodell + ContentService
  core/                    # Fortschritt (localStorage), Theme, UI-Texte DE/EN
  layout/                  # Shell, Header, Sidebar
  pages/                   # Startseite, Lektion (inkl. Quiz und Live-Editor), 404
```

## Eine Lektion schreiben

```markdown
---
title: Meine Lektion
minutes: 6
quiz:
  - question: Frage?
    options: [A, B, C]
    answer: 1              # Index der richtigen Antwort
    explanation: Erklärung, darf `Markdown` enthalten.
---

# Meine Lektion

Text mit `Code`, Tabellen und Codeblöcken (```ts, ```html, ```bash …).

> [!TIP]
> Hinweisboxen: NOTE, TIP, WARNING

::tryit{beispiel-id}
```

- Ordner- und Dateinamen bestimmen URL und Reihenfolge (`02-templates/01-interpolation.md` → `/de/templates/interpolation`). Sie müssen in allen Sprachen gleich sein.
- `::tryit{id}` bettet das Beispiel aus `examples/<id>/` als echtes Vite-+-React-Projekt (StackBlitz) ein. Geöffnet wird `src/App.tsx`, außer `meta.json` sagt `"openFile"` etwas anderes.
- Die Beispiele laufen auf **React 19 + Vite 7** (`examples/_base/package.json`). Vite 8 nutzt rolldown – dieselbe Toolchain, mit der Angular 22 in StackBlitz-WebContainern nicht startete. Vor einem Upgrade in StackBlitz testen.
- Codeblöcke in Lektionen: ```tsx, ```ts, ```jsx, ```css, ```bash …
- Die Einbettung braucht Cross-Origin-Isolation (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless`), gesetzt in `netlify.toml` und für `npm start` in `angular.json`. Externe Ressourcen auf der Plattform selbst (Bilder, Skripte) werden deshalb ohne Cookies geladen.
- Jede Lektion muss in allen Sprachen existieren, sonst bricht `npm run content` ab.
- Tabellen brauchen in jeder Kopfzelle Text (leere Kopfzellen sind ein axe-Fehler). Quiztexte können nur Inline-Code, kein Fett. `npm run content` bricht in beiden Fällen ab.
- Frontmatter-Werte mit ` #`, `: `, `{`, `[` oder Backticks am Anfang in Anführungszeichen setzen, sonst liest YAML sie falsch (` #` startet z. B. einen Kommentar).

## Eine Übung schreiben

Eine Übung ist ein Beispielprojekt mit Startcode, Prüfungen und Lösung:

```
examples/ex-<name>/
  meta.json                  # { "exercise": true, "openFile": "…" }
  src/App.tsx …              # Startcode mit TODO-Kommentaren
  src/exercise/checks.tsx    # Prüfungen (siehe unten)
  solution/src/…             # Lösung – wird auf der Seite angezeigt, nicht ins Projekt kopiert
```

Beim Bauen bekommt jede Übung zusätzlich das Prüf-Kit aus `examples/_exercise-kit/`: Ein eigenes `src/main.tsx` startet die App und führt danach die Prüfungen aus, ein eigenes `vite.config.ts` lädt die Vorschau bei jedem Speichern komplett neu (statt Hot Reload). Das Ergebnis geht per `postMessage` an die Kursseite.

```tsx
// src/exercise/checks.tsx
import type { Check } from './check-kit';
import Greeting from '../Greeting';

export const exercise = 'ex-<name>';

export const checks: Check[] = [
  {
    id: 'counter-updates',
    run: async (t) => {
      await t.click(t.button('+'));
      t.expectText('#count', '1');
    },
  },
  {
    // Eine Komponente einzeln mit anderen Props rendern
    id: 'greeting-prop',
    run: async (t) => {
      const view = await t.render(<Greeting name="Ada" />);
      view.expectText('h2', 'Ada');
    },
  },
];
```

Die Prüfungen laufen nacheinander auf derselben App. `t.type()` und `t.select()` setzen Werte so, dass React sie auch bei kontrollierten Feldern mitbekommt. Stürzt eine Komponente ab, schlagen die betroffenen Prüfungen mit „The app crashed: …“ fehl.

In der Lektion verweist das Frontmatter auf die Übung und beschriftet jede Prüfung:

```yaml
exercise:
  example: ex-<name>
  title: Zähler
  task: |
    Markdown mit der Aufgabe …
  checks:
    counter-updates: Nach **+** zeigt es 1
    greeting-prop: Greeting zeigt den übergebenen Namen
```

`npm run content` bricht ab, wenn Prüf-IDs in `checks.tsx` und Frontmatter nicht übereinstimmen.

**Vor dem Commit prüfen:** Der Startcode muss mindestens eine Prüfung verfehlen und die Lösung alle bestehen (`node scripts/verify-exercises.mjs`).
