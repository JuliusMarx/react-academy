---
title: Vitest und Testing Library
minutes: 9
quiz:
  - question: "Welche Abfrage solltest du bevorzugen, um einen Button zu finden?"
    options: ["`container.querySelector('.btn')`","`document.getElementsByTagName('button')[0]`","`screen.getByTestId('save')`","`screen.getByRole('button', { name: 'Speichern' })`"]
    answer: 3
    explanation: "Rollen und sichtbare Namen sind das, was auch Nutzer und Screenreader wahrnehmen. Test-IDs sind der letzte Ausweg."
  - question: "Was ist der Unterschied zwischen `getByText` und `queryByText`?"
    options: ["`getBy…` wirft einen Fehler, wenn nichts gefunden wird, `queryBy…` gibt `null` zurück","Es gibt keinen","`queryBy…` wartet, bis das Element erscheint","`queryBy…` findet mehrere Elemente"]
    answer: 0
  - question: "Was prüft Testing Library – Implementierung oder Verhalten?"
    options: ["Die Implementierung: State, Props, interne Funktionen", "Das Verhalten: was auf dem Bildschirm steht und wie man damit interagiert", "Nur das CSS", "Nur die Performance"]
    answer: 1
exercise:
  example: ex-test-render
  title: Tests für einen Badge
  task: |-
    Schreibe in `UserBadge.test.tsx` Tests mit `render()` und `screen`:

    1. Der Badge zeigt den übergebenen Namen und die Rolle (z. B. **Grace** und **Admin**).
    2. Ohne Rolle zeigt er **Member**.

    Die Vorschau führt deine Tests aus und zeigt das Ergebnis. Die Prüfungen testen sie zusätzlich gegen absichtlich kaputte Versionen des Badges – gute Tests bemerken jede davon.
  checks:
    tests-pass: Mindestens zwei Tests, alle grün
    catches-name: Ein Badge, der immer „Ada“ zeigt, fällt auf
    catches-role: Ein Badge, der die Rolle ignoriert, fällt auf
    catches-default: Ein Badge ohne Standardrolle fällt auf
---

# Vitest und Testing Library

Tests geben dir die Sicherheit, Code zu ändern, ohne versehentlich etwas kaputtzumachen. Für React-Komponenten ist die verbreitetste Kombination **Vitest** (Test-Runner, passt perfekt zu Vite) und **React Testing Library** (Komponenten rendern und abfragen).

## Einrichten

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // ein simuliertes DOM in Node
    setupFiles: ['./src/setupTests.ts'],
  },
});
```

```ts
// src/setupTests.ts – Matcher wie toBeInTheDocument()
import '@testing-library/jest-dom/vitest';
```

Mit `npx vitest` laufen alle Dateien, die auf `.test.tsx` enden – im Watch-Modus bei jeder Änderung erneut.

> [!NOTE]
> In den Beispielen dieses Kurses laufen die Tests direkt in der Vorschau, in einem kleinen Vitest-kompatiblen Runner. Du schreibst sie genauso wie in einem echten Projekt.

## Der erste Test

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Greeting from './Greeting';

describe('Greeting', () => {
  it('begrüßt den Nutzer mit Namen', () => {
    render(<Greeting name="Ada" />);
    expect(screen.getByRole('heading', { name: 'Hallo, Ada!' })).toBeInTheDocument();
  });
});
```

- **`describe`** gruppiert Tests, **`it`** (oder `test`) ist ein einzelner Test.
- **`render`** rendert die Komponente in ein echtes bzw. simuliertes DOM.
- **`screen`** fragt die ganze Seite ab, **`expect`** prüft das Ergebnis.

## Abfragen wie ein Nutzer

Testing Library verfolgt eine klare Idee: Teste, was Nutzer sehen und tun – nicht, wie die Komponente intern gebaut ist. Deshalb fragst du Elemente so ab, wie ein Mensch sie findet. In dieser Reihenfolge:

| Abfrage | Findet … |
|---|---|
| `getByRole('button', { name: 'Speichern' })` | Elemente nach Rolle und zugänglichem Namen – die erste Wahl |
| `getByLabelText('E-Mail')` | Formularfelder über ihr Label |
| `getByText('Keine Treffer')` | sichtbaren Text |
| `getByTestId('chart')` | über `data-testid` – nur, wenn nichts anderes geht |

Ein schöner Nebeneffekt: Findet `getByRole` deinen Button nicht, ist er wahrscheinlich auch für Screenreader schlecht zugänglich.

## getBy, queryBy, findBy

| Variante | Wenn nichts gefunden wird | Verwenden für |
|---|---|---|
| `getBy…` | wirft einen Fehler | Elemente, die da sein müssen |
| `queryBy…` | gibt `null` zurück | prüfen, dass etwas **nicht** da ist |
| `findBy…` | wartet (Promise) | Elemente, die erst später erscheinen |

```tsx
expect(screen.queryByText(/fehler/i)).toBeNull();
expect(await screen.findByText('Gespeichert')).toBeInTheDocument();
```

Für mehrere Treffer gibt es jeweils `getAllBy…`, `queryAllBy…` und `findAllBy…`.

::tryit{test-basics}
