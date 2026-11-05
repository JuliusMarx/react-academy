---
title: Benutzeraktionen testen
minutes: 8
summary: |-
  - `@testing-library/user-event` simuliert Interaktionen wie ein Mensch: Ein Klick löst Zeiger-, Fokus-, `mousedown`-, `mouseup`- und `click`-Ereignisse aus.
  - Erzeuge zu Beginn jedes Tests einen Nutzer mit `userEvent.setup()`.
  - Alle Aktionen sind asynchron, also immer mit `await`: `user.click`, `user.type`, `user.clear`, `user.selectOptions`, `user.keyboard('{Enter}')`, `user.tab()`.
  - `fireEvent` löst nur ein einzelnes Event aus – nimm es nur, wenn `userEvent` etwas nicht kann.
  - Erscheint etwas erst später, wartest du mit `await screen.findBy…` (bis zu einer Sekunde) oder mit `waitFor(() => …)`.

  ```tsx
  it('zählt Klicks', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: 'Erhöhen' }));

    expect(screen.getByLabelText('count')).toHaveTextContent('1');
  });
  ```

  > [!TIP] Teste Verhalten („Nach dem Klick steht ‚Gespeichert‘ da“), nicht Zwischenschritte wie „`setSaved` wurde aufgerufen“.
quiz:
  - question: "Warum nimmst du `userEvent` statt `fireEvent`?"
    options: ["`fireEvent` gibt es nicht mehr", "`userEvent` simuliert eine echte Interaktion mit allen Ereignissen (Fokus, Tastendrücke, Klick) – `fireEvent` löst nur ein einzelnes Event aus", "`userEvent` ist synchron", "Es gibt keinen Unterschied"]
    answer: 1
  - question: "Was musst du bei `user.click(…)` beachten?"
    options: ["Nichts","Es funktioniert nur mit `<a>`","Es gibt ein Promise zurück – du musst es mit `await` abwarten","Man muss vorher `act()` aufrufen"]
    answer: 2
  - question: "Ein Text erscheint erst nach einem asynchronen Speichern. Wie wartest du darauf?"
    options: ["`setTimeout` im Test","Gar nicht, das ist nicht testbar","`getByText` reicht","`await screen.findByText('Gespeichert')`"]
    answer: 3
exercise:
  example: ex-test-events
  title: Einen Zähler testen
  task: |-
    Teste `Counter` mit `userEvent` (`const user = userEvent.setup(); await user.click(…)`):

    1. **Increment** erhöht um 1.
    2. **Decrement** verringert um 1 – aber nie unter 0.
    3. **Reset** setzt auf 0 zurück.

    Den Wert liest du mit `screen.getByLabelText('count')`.
  checks:
    tests-pass: Mindestens drei Tests, alle grün
    catches-step: Ein Zähler, der um 2 erhöht, fällt auf
    catches-negative: Ein Zähler, der unter 0 geht, fällt auf
    catches-reset: Ein Reset, der nichts tut, fällt auf
---

# Benutzeraktionen testen

Die meisten Fehler stecken in Interaktionen: Klicks, Eingaben, Formulare. Mit **`@testing-library/user-event`** simulierst du sie so, wie ein Mensch sie ausführen würde.

## userEvent

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('zählt Klicks', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole('button', { name: 'Erhöhen' }));

  expect(screen.getByLabelText('count')).toHaveTextContent('1');
});
```

- **`userEvent.setup()`** erzeugt einen „Nutzer“ – am besten zu Beginn jedes Tests.
- Alle Aktionen sind **asynchron**. Vergiss das `await` nicht, sonst prüfst du, bevor die Aktion fertig ist.
- Ein Klick löst wie im Browser alle Ereignisse aus: Zeiger, Fokus, `mousedown`, `mouseup`, `click`.

## Die wichtigsten Aktionen

| Aktion | Simuliert |
|---|---|
| `await user.click(element)` | einen Klick |
| `await user.type(input, 'Hallo')` | Tippen, Zeichen für Zeichen |
| `await user.clear(input)` | Feld leeren |
| `await user.selectOptions(select, 'pro')` | Auswahl in einem `<select>` |
| `await user.keyboard('{Enter}')` | Tastendrücke |
| `await user.tab()` | mit Tab zum nächsten Element |

`fireEvent` aus Testing Library löst dagegen nur ein einzelnes Event aus. Es ist schneller, aber weniger realistisch – nimm es nur, wenn `userEvent` etwas nicht kann.

## Auf Änderungen warten

Erscheint etwas erst nach einer asynchronen Aktion, nimm **`findBy…`**. Es wartet bis zu einer Sekunde:

```tsx
await user.click(screen.getByRole('button', { name: 'Speichern' }));
expect(await screen.findByText('Gespeichert!')).toBeInTheDocument();
```

Für alles andere gibt es **`waitFor`**, das eine Prüfung so lange wiederholt, bis sie klappt:

```tsx
await waitFor(() => expect(onSave).toHaveBeenCalled());
```

> [!TIP]
> Teste **Verhalten**, nicht Zwischenschritte: „Nach Klick auf Speichern steht ‚Gespeichert‘ da“ ist ein guter Test. „Die Funktion `setSaved` wurde aufgerufen“ testet die Implementierung – und bricht beim nächsten Umbau, obwohl alles funktioniert.

::tryit{test-interactions}
