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

Die Seite läuft auf Netlify unter <https://react-academy-de.netlify.app> (Projekt `react-academy-de`). Die Konfiguration steht in [netlify.toml](netlify.toml): Ausgabeordner, Weiterleitungen (Startseite je nach Browsersprache auf `/de` oder `/en`) und Header (u. a. COOP/COEP für StackBlitz).

Das Repo ist **nicht** mit Netlify verbunden – Pushes lösen keinen Deploy aus. Veröffentlicht wird manuell mit dem lokal gebauten Stand, das spart Build-Minuten auf Netlify:

```bash
npm run build
npx netlify-cli deploy --prod --no-build --dir dist/react-academy/browser --site react-academy-de
```

Die Netlify-CLI muss dafür einmal mit `npx netlify-cli login` angemeldet sein. Deploy-Previews (`deploy` ohne `--prod`) sind nur mit Netlify-Login sichtbar, die Live-Seite ist öffentlich.

Lokal testen, inklusive der Netlify-Regeln:

```bash
npm run build
npx netlify-cli dev --offline --dir dist/react-academy/browser
```

## Projektstruktur

```
content/<sprache>/<NN-kapitel>/
  _chapter.md              # Kapitel-Titel, -Beschreibung und Frage für den Einstufungstest (Frontmatter)
  <NN-lektion>.md          # Lektion: Markdown + Frontmatter (title, minutes, summary, quiz)
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
summary: |-               # Pflicht: Kurzfassung für den Kurzkurs (Ansicht „Kurz“)
  - 4–7 Kernpunkte mit `Code`, danach meist ein kurzer Codeblock
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
- Braucht ein Beispiel weitere npm-Pakete, stehen sie in `meta.json` unter `"dependencies"` (z. B. `{ "dependencies": { "@tanstack/react-query": "^5.105.0" } }`). Sie werden in die `package.json` der Basis übernommen.
- Codeblöcke in Lektionen: ```tsx, ```ts, ```jsx, ```css, ```bash …
- Die Einbettung braucht Cross-Origin-Isolation (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless`), gesetzt in `netlify.toml` und für `npm start` in `angular.json`. Externe Ressourcen auf der Plattform selbst (Bilder, Skripte) werden deshalb ohne Cookies geladen.
- Jede Lektion muss in allen Sprachen existieren, sonst bricht `npm run content` ab.
- Der Einstufungstest (`/de/placement`) stellt pro Kapitel eine Quizfrage, ausgewählt in `_chapter.md` mit `placement: { lesson: <lektion>, question: <index> }`. Wer sie richtig beantwortet, kann das ganze Kapitel als erledigt markieren. Die Frage sollte also den Kern des Kapitels abfragen. Die Antworten werden im Test rotiert, damit die richtige nicht immer an derselben Stelle steht.
- Die richtige Quiz-Antwort soll nicht immer an derselben Stelle stehen. `node scripts/shuffle-quiz-answers.cjs content` verteilt sie gleichmäßig – in allen Sprachen gleich. Am besten nach dem Schreiben der deutschen Lektion und vor der Übersetzung ausführen.
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

Beim Bauen bekommt jede Übung zusätzlich das Prüf-Kit aus `examples/_exercise-kit/`: Ein eigenes `src/main.tsx` startet die App, führt danach die Prüfungen aus und lädt die Vorschau bei jedem Speichern komplett neu (statt Hot Reload). Die `vite.config.ts` des Beispiels bleibt unberührt – Übungen können also eigene Vite-Plugins (z. B. Tailwind) haben. Das Ergebnis geht per `postMessage` an die Kursseite.

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

Die Prüfungen laufen nacheinander auf derselben App. Natives Absenden von Formularen (Seiten-Neuladen) blockiert das Kit, damit ein unfertiger Startcode keine Endlosschleife aus Neuladen und Prüfen auslöst. Für Routing gibt es `t.navigate('/pfad')` (wie Vor/Zurück im Browser) und `t.path()`. `t.type()` und `t.select()` setzen Werte so, dass React sie auch bei kontrollierten Feldern mitbekommt. Stürzt eine Komponente ab, schlagen die betroffenen Prüfungen mit „The app crashed: …“ fehl.

Wo sich etwas nicht am Verhalten erkennen lässt (z. B. „ohne useEffect“), dürfen Prüfungen den Quelltext lesen: `import raw from '../App.tsx?raw'` (Vite liefert die Datei als String), dann `const source = code(raw)` aus dem Prüf-Kit – das entfernt Kommentare, damit TODO-Hinweise im Startcode nicht als Lösung zählen. Sparsam einsetzen – Verhalten zu prüfen ist robuster. Zeitabhängige Prüfungen messen die tatsächlich vergangene Zeit, weil Browser Timer in Hintergrund-Tabs verzögern.

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

### Test-Beispiele und Test-Übungen

Mit `"kit": "test"` in `meta.json` startet die Vorschau nicht die App, sondern führt alle `*.test.tsx`-Dateien aus und zeigt das Ergebnis (`examples/_test-kit/`). `import { describe, it, expect, vi } from 'vitest'` zeigt per Vite-Plugin (`vite.testing.ts`) auf einen kleinen Vitest-kompatiblen Runner in `src/testing/`. React Testing Library und user-event sind echt – sie laufen im Browser. `expect` kennt die gängigen Matcher inklusive der jest-dom-Matcher (`toBeInTheDocument`, `toHaveTextContent`, `toBeDisabled` …), `vi` bietet `fn` und `spyOn`.

Weil die Vorschau meist keinen Fokus hat (man tippt im Editor), feuern Browser dort keine Focus-Events – user-event braucht sie aber für `user.type`. Der Runner löst sie deshalb in `focus()` selbst aus.

Test-Übungen (`"kit": "test", "exercise": true`, `examples/_test-exercise-kit/`) prüfen die Tests der Lernenden per **Mutationstest**:

- `t.runTests(n)`: mindestens `n` Tests, alle grün gegen den echten Code.
- `t.expectCaught('Mutant', 'Meldung')`: Gegen den Mutanten aus `src/exercise/mutants.tsx` muss mindestens ein Test fehlschlagen. Ein Vite-Plugin macht dafür den Default-Export jeder Komponente in `src/*.tsx` austauschbar; `mutants` ordnet Komponentennamen ihre kaputte Version zu: `{ NoReset: { Counter: KaputterCounter } }`.
