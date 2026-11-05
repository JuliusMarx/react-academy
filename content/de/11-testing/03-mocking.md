---
title: Mocks
minutes: 8
summary: |-
  - Mocks ersetzen Abhängigkeiten, die du im Test nicht echt haben willst, und zeichnen auf, wie sie aufgerufen wurden.
  - Für Callback-Props übergibst du `vi.fn()` und prüfst mit `toHaveBeenCalledTimes(n)`, `toHaveBeenCalledWith(…)` oder `not.toHaveBeenCalled()`.
  - `mockReturnValue(42)` oder `mockResolvedValue(data)` legt fest, was der Mock zurückgibt.
  - `vi.spyOn(globalThis, 'fetch')` simuliert Serverantworten ohne Server. Mit `new Response('{}', { status: 500 })` testest du den Fehlerfall.
  - Nach jedem Test stellst du die Originale wieder her: `vi.restoreAllMocks()` in `afterEach` oder `restoreMocks: true` in der Konfiguration.
  - `vi.mock('./api')` ersetzt ganze Module; MSW fängt Anfragen auf Netzwerkebene ab.

  ```tsx
  it('lädt den Nutzer', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ id: 7, name: 'Grace Hopper' })));

    render(<UserCard userId={7} />);

    expect(await screen.findByRole('heading', { name: 'Grace Hopper' })).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledWith('/api/users/7');
  });
  ```

  > [!WARNING] Mocke so wenig wie möglich – jeder Mock ist eine Annahme, und zu viele prüfen deine Annahmen statt des echten Zusammenspiels.
quiz:
  - question: "Wie prüfst du, dass eine Komponente ihre Callback-Prop `onSave` mit den richtigen Daten aufruft?"
    options: ["Mit `console.log`","Mit einem echten Server","Gar nicht","Mit `const onSave = vi.fn()` und `expect(onSave).toHaveBeenCalledWith(…)`"]
    answer: 3
  - question: "Wie ersetzt du `fetch` in einem Test?"
    options: ["Mit `vi.spyOn(globalThis, 'fetch').mockResolvedValue(…)`", "Indem du das Netzwerk abschaltest", "Mit `window.fetch = undefined`", "Gar nicht, Tests brauchen einen Server"]
    answer: 0
  - question: "Was ist ein Nachteil von zu vielen Mocks?"
    options: ["Tests werden langsamer", "Die Tests prüfen dann eher deine Annahmen als das echte Zusammenspiel", "Mocks funktionieren nicht mit React", "Es gibt keinen"]
    answer: 1
exercise:
  example: ex-test-mocks
  title: Ein Formular mit Mock testen
  task: |-
    Teste `SubscribeForm` mit einer Mock-Funktion (`const onSubscribe = vi.fn()`):

    1. Mit einer gültigen E-Mail ruft **Subscribe** `onSubscribe` genau einmal auf – mit genau dieser E-Mail.
    2. Mit einer ungültigen E-Mail (ohne **@**) erscheint die Fehlermeldung, und `onSubscribe` wird **nicht** aufgerufen.
  checks:
    tests-pass: Mindestens zwei Tests, alle grün
    catches-argument: Ein Formular, das eine andere E-Mail übergibt, fällt auf
    catches-invalid: Ein Formular, das ungültige E-Mails durchlässt, fällt auf
---

# Mocks

Viele Komponenten hängen von etwas ab, das du im Test nicht echt haben willst: eine Callback-Prop der Elternkomponente, ein Server, die aktuelle Zeit. Dafür ersetzt du sie durch **Mocks** – Attrappen, die aufzeichnen, wie sie aufgerufen wurden.

## Mock-Funktionen mit vi.fn

Für Callback-Props übergibst du eine Mock-Funktion und prüfst danach, wie sie aufgerufen wurde:

```tsx
import { vi } from 'vitest';

it('meldet das Abonnement', async () => {
  const onSubscribe = vi.fn();
  const user = userEvent.setup();
  render(<SubscribeForm onSubscribe={onSubscribe} />);

  await user.type(screen.getByLabelText('E-Mail'), 'ada@example.com');
  await user.click(screen.getByRole('button', { name: 'Abonnieren' }));

  expect(onSubscribe).toHaveBeenCalledTimes(1);
  expect(onSubscribe).toHaveBeenCalledWith('ada@example.com');
});
```

| Matcher | Prüft |
|---|---|
| `toHaveBeenCalled()` | wurde mindestens einmal aufgerufen |
| `toHaveBeenCalledTimes(n)` | genau `n`-mal |
| `toHaveBeenCalledWith(...args)` | mit diesen Argumenten |
| `not.toHaveBeenCalled()` | gar nicht |

Mit `vi.fn().mockReturnValue(42)` oder `.mockResolvedValue(data)` legst du fest, was der Mock zurückgibt.

## fetch ersetzen mit vi.spyOn

`vi.spyOn(objekt, 'methode')` ersetzt eine vorhandene Funktion durch einen Mock. Damit simulierst du Serverantworten, ohne dass es einen Server gibt:

```tsx
it('lädt den Nutzer', async () => {
  const fetchSpy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({ id: 7, name: 'Grace Hopper' })));

  render(<UserCard userId={7} />);

  expect(await screen.findByRole('heading', { name: 'Grace Hopper' })).toBeInTheDocument();
  expect(fetchSpy).toHaveBeenCalledWith('/api/users/7');
});
```

Mit einer Antwort wie `new Response('{}', { status: 500 })` testest du auch den Fehlerfall. Nach jedem Test stellst du das Original wieder her – mit `vi.restoreAllMocks()` in `afterEach` oder der Option `restoreMocks: true` in der Vitest-Konfiguration.

## Ganze Module ersetzen

In echten Vitest-Projekten kannst du mit `vi.mock('./api')` ein ganzes Modul durch Mocks ersetzen. Für Netzwerkanfragen ist **MSW** (Mock Service Worker) beliebt: Es fängt Anfragen auf Netzwerkebene ab, sodass dein Code genau so läuft wie in Produktion.

> [!WARNING]
> Mocke so wenig wie möglich. Jeder Mock ist eine Annahme darüber, wie die echte Abhängigkeit sich verhält. Je mehr du mockst, desto eher prüfen deine Tests diese Annahmen statt des echten Zusammenspiels.

::tryit{test-mocking}
