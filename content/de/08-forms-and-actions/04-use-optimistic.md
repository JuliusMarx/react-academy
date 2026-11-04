---
title: useOptimistic
minutes: 8
quiz:
  - question: "Was zeigt `useOptimistic`, während eine Action läuft?"
    options: ["Den alten State","Einen Ladeindikator","Den optimistischen Wert – so, als wäre die Action schon erfolgreich","Nichts"]
    answer: 2
  - question: "Die Action schlägt fehl. Was passiert mit dem optimistischen Eintrag?"
    options: ["Er bleibt für immer stehen","Du musst ihn manuell löschen","React wirft einen Fehler","Er verschwindet von selbst, weil `useOptimistic` nach der Action wieder den echten State zeigt"]
    answer: 3
  - question: "Wo musst du die Funktion aus `useOptimistic` aufrufen?"
    options: ["In einer Action bzw. Transition","Beim Rendern","In `useEffect`","Überall"]
    answer: 0
exercise:
  example: ex-optimistic
  title: Optimistische Todos
  task: |-
    Neue Todos erscheinen erst, wenn der Server nach 0,6 Sekunden antwortet. Lass sie sofort erscheinen:

    1. Erzeuge mit `useOptimistic(todos, …)` eine optimistische Liste: Ein neuer Titel hängt `{ id: -1, title, saving: true }` an.
    2. Füge den Titel in der Action optimistisch hinzu, bevor du auf `saveTodo` wartest, und zeige die optimistische Liste an. Noch nicht gespeicherte Todos haben `className="saving"`.

    Schlägt das Speichern fehl (Titel mit **fail**), verschwindet der optimistische Eintrag von selbst – der Fehler steht in `#error`.
  checks:
    shows-immediately: Ein neues Todo erscheint sofort mit der Klasse `saving`
    confirmed: Nach dem Speichern steht es genau einmal ohne `saving` in der Liste
    rollback: Schlägt das Speichern fehl, verschwindet es wieder und der Fehler erscheint
---

# useOptimistic

Bei vielen Aktionen ist das Ergebnis fast immer dasselbe: Die Nachricht wird gesendet, das Like gezählt, das Todo gespeichert. Statt auf den Server zu warten, kannst du das Ergebnis **sofort** anzeigen und nur im Fehlerfall zurückrollen. Das nennt man **optimistisches UI**.

## useOptimistic

```tsx
import { startTransition, useOptimistic, useState } from 'react';

function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, text: string) => [...current, { id: -1, text, sending: true }],
  );

  async function sendAction(formData: FormData) {
    const text = String(formData.get('text'));
    addOptimistic(text); // sofort sichtbar
    const saved = await deliver(text);
    startTransition(() => setMessages((m) => [...m, saved]));
  }

  return (
    <>
      <ul>
        {optimisticMessages.map((m) => (
          <li key={m.id}>{m.text} {m.sending && '(wird gesendet …)'}</li>
        ))}
      </ul>
      <form action={sendAction}>
        <input name="text" />
        <button>Senden</button>
      </form>
    </>
  );
}
```

- `useOptimistic(state, updateFn)` liefert eine **optimistische Kopie** von `state` und eine Funktion, um sie zu ändern.
- `updateFn` beschreibt, wie ein optimistischer Wert auf den aktuellen State angewendet wird.
- Du zeigst die **optimistische** Liste an, nicht die echte.

## Wie es zurückrollt

Der optimistische Wert gilt nur, **solange die Action läuft**. Ist sie fertig, zeigt `useOptimistic` wieder den echten State:

- **Erfolg**: Du hast den echten State inzwischen aktualisiert – der Eintrag bleibt, nun ohne „wird gesendet“.
- **Fehler**: Der echte State hat sich nicht geändert – der optimistische Eintrag verschwindet von selbst. Zeige dazu eine Fehlermeldung an.

Ein Aufräumen im Fehlerfall ist nicht nötig.

> [!NOTE]
> Die Funktion aus `useOptimistic` rufst du innerhalb einer Action oder Transition auf. Und: State-Änderungen **nach einem `await`** gehören (noch) nicht automatisch zur Transition. Umhülle sie deshalb mit `startTransition`, wie im Beispiel.

## Wann optimistisch?

Optimistisches UI passt zu Aktionen, die fast immer klappen und leicht zurückzunehmen sind: Likes, Nachrichten, Häkchen, Umbenennen. Bei Zahlungen oder Bestellungen zeigst du lieber ehrlich einen Ladezustand an.

::tryit{optimistic}
