---
title: Änderungen ansagen und testen
minutes: 9
summary: |-
  - Ändert sich etwas, ohne dass der Fokus dorthin wandert („Gespeichert“, „12 Treffer“), bekommt ein Screenreader es nur über eine **Live-Region** mit.
  - `role="status"` sagt höflich an, wenn gerade nichts anderes läuft. `role="alert"` unterbricht – nur für Wichtiges und Dringendes. Allgemein: `aria-live="polite"` oder `"assertive"`.
  - Die Region muss schon im DOM stehen, bevor sich ihr Text ändert. Also immer rendern und nur den Inhalt austauschen – nicht erst mit der Meldung einfügen.
  - In Tests mit `getByRole` und Namen abfragen: Was Testing Library so nicht findet, finden Screenreader oft auch nicht. Fokus prüfst du mit `toHaveFocus()` und `user.tab()`.
  - axe findet viele Fehler automatisch: als Browser-Erweiterung (axe DevTools) oder mit `axe-core` im Test, z. B. über `vitest-axe`. In jsdom funktioniert der Kontrast-Check nicht.
  - Automatische Tests finden nur einen Teil der Probleme. Prüf selbst: nur mit Tastatur, mit Screenreader, mit 200 % Zoom.

  ```tsx
  // Die Region steht immer da – nur ihr Text ändert sich
  <p role="status">{saved ? 'Gespeichert' : ''}</p>
  ```
quiz:
  - question: "Warum zeigt `{saved && <p role=\"status\">Gespeichert</p>}` die Meldung zwar an, wird aber oft nicht angesagt?"
    options: ["`role=\"status\"` gibt es nicht", "Die Live-Region entsteht erst zusammen mit dem Text – Screenreader sagen nur Änderungen in Regionen an, die es schon gab", "Weil `&&` in JSX nicht funktioniert", "Screenreader sagen grundsätzlich nur `role=\"alert\"` an"]
    answer: 1
    explanation: "Render die Region immer und tausche nur den Inhalt aus: `<p role=\"status\">{saved ? 'Gespeichert' : ''}</p>`."
  - question: "Wann nimmst du `role=\"alert\"` statt `role=\"status\"`?"
    options: ["Immer, damit nichts überhört wird","Für Suchergebnisse beim Tippen","Nur für wichtige, dringende Meldungen – `alert` unterbricht, was der Screenreader gerade vorliest","Nie, `alert` ist veraltet"]
    answer: 2
  - question: "Ein Test mit axe meldet keine Fehler. Was heißt das?"
    options: ["Dass axe nicht richtig eingerichtet ist","Die App ist vollständig barrierefrei","Die App erfüllt alle WCAG-Kriterien","Die automatisch prüfbaren Regeln sind erfüllt – ob die Seite wirklich gut bedienbar ist, zeigt erst ein Test mit Tastatur und Screenreader"]
    answer: 3
---

# Änderungen ansagen und testen

Sehende Nutzer bemerken, wenn irgendwo „Gespeichert“ erscheint. Ein Screenreader liest aber nur vor, wo der Fokus ist. Für Meldungen, die anderswo auftauchen, gibt es **Live-Regionen**. Und damit das alles so bleibt, testest du es.

## Live-Regionen

Eine Live-Region ist ein Element, dessen Änderungen der Screenreader von selbst ansagt:

| Markup | Ansage | Wofür |
|---|---|---|
| `role="status"` | höflich, wenn gerade nichts anderes läuft | „Gespeichert“, „12 Treffer“, Fortschritt |
| `role="alert"` | sofort, unterbricht | Fehler, die sofort wichtig sind |
| `aria-live="polite"` | wie `status` | allgemeine Regionen |
| `aria-live="assertive"` | wie `alert` | sparsam einsetzen |

Die wichtigste Regel: Die Region muss **schon da sein**, bevor sich ihr Inhalt ändert. Screenreader beobachten Regionen, die es gibt – eine, die zusammen mit ihrem Text erscheint, wird oft gar nicht angesagt.

```tsx
// ✗ Region und Text erscheinen gleichzeitig
{saved && <p role="status">Gespeichert</p>}

// ✓ Region steht immer da, nur der Text ändert sich
<p role="status">{saved ? 'Gespeichert' : ''}</p>
```

Bei `role="alert"` sagen die meisten Screenreader auch neu eingefügte Elemente an – darauf verlassen solltest du dich aber nicht.

- Nicht jede Änderung ansagen. Zu viele Meldungen nerven und überdecken die wichtigen.
- Bekommt das neue Element ohnehin den Fokus (z. B. ein Dialog), brauchst du keine Live-Region.

## Testen mit Rollen

Testing Library (Kapitel 11) fragt Elemente so ab, wie Hilfsmittel sie sehen: nach **Rolle** und **zugänglichem Namen**. Damit prüft jeder Test nebenbei die Barrierefreiheit:

```tsx
render(<Newsletter />);

screen.getByRole('heading', { level: 2, name: 'Newsletter' });
screen.getByRole('textbox', { name: 'E-Mail' }); // findet das Feld nur mit Label
screen.getByRole('button', { name: 'Abonnieren' });
screen.getByRole('status'); // die Live-Region
```

Ein `<div onClick>` findet `getByRole('button')` nicht, ein Feld ohne Label findet `getByRole('textbox', { name })` nicht. Elemente mit `aria-hidden` überspringt `getByRole` standardmäßig – wie ein Screenreader.

Auch Fokus lässt sich testen:

```tsx
const user = userEvent.setup();
render(<Toolbar />);

await user.tab();
expect(screen.getByRole('button', { name: 'Fett' })).toHaveFocus();
```

## axe

**axe** von Deque prüft eine Seite gegen eine lange Liste von Regeln: fehlende Labels und `alt`-Texte, Buttons ohne Namen, ungültiges ARIA, zu wenig Kontrast und mehr. Du kannst es auf zwei Arten nutzen:

- **Im Browser:** Die Erweiterung *axe DevTools* für Chrome, Edge und Firefox prüft die geöffnete Seite. Auch Lighthouse in den Chrome DevTools nutzt axe für seinen Accessibility-Bericht.
- **Im Test:** Die Bibliothek `axe-core` prüft gerenderte Komponenten. Für Vitest gibt es `vitest-axe` mit dem Matcher `toHaveNoViolations()`:

```bash
npm install -D vitest-axe
```

```ts
// src/setupTests.ts
import 'vitest-axe/extend-expect';
```

```tsx
import { axe } from 'vitest-axe';

it('hat keine axe-Fehler', async () => {
  const { container } = render(<Newsletter />);
  expect(await axe(container)).toHaveNoViolations();
});
```

> [!WARNING]
> `vitest-axe` funktioniert mit jsdom, nicht mit happy-dom. Und jsdom berechnet kein Layout – den Kontrast kann axe dort nicht prüfen. Das übernimmt die Browser-Erweiterung oder ein Playwright-Test mit `@axe-core/playwright`.

Im Beispiel unten laufen die Tests im echten Browser. Dort ruft der Test `axe.run()` aus `axe-core` direkt auf und prüft die Liste der verletzten Regeln.

::tryit{a11y-tests}

## Was Tools nicht finden

Automatische Prüfungen finden nur einen Teil der Probleme. Ob ein `alt`-Text das Bild sinnvoll beschreibt, ob der Fokus nach dem Löschen an der richtigen Stelle landet oder ob eine Ansage verständlich ist, sieht kein Tool. Deshalb zusätzlich von Hand:

1. **Nur mit der Tastatur:** Tab, Shift+Tab, Enter, Leertaste, Escape, Pfeiltasten. Ist der Fokus immer sichtbar? Kommst du überall hin und wieder heraus?
2. **Mit Screenreader:** VoiceOver (macOS, iOS), NVDA (Windows, kostenlos), TalkBack (Android). Schon ein paar Minuten zeigen viel.
3. **Mit Zoom:** Bei 200 % muss noch alles lesbar und bedienbar sein.
