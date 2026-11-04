---
title: Form Actions
minutes: 7
quiz:
  - question: "Was bekommt eine Funktion, die du an `<form action={…}>` übergibst?"
    options: ["Das Submit-Event","Den State der Komponente","Ein `FormData`-Objekt mit den Feldern des Formulars","Nichts"]
    answer: 2
  - question: "Was passiert mit unkontrollierten Feldern, nachdem eine Form Action fertig ist?"
    options: ["Sie behalten ihren Wert","Die Seite lädt neu","Sie werden deaktiviert","React setzt das Formular automatisch zurück"]
    answer: 3
  - question: "Wie liest du in einer Action den Wert des Felds `<input name=\"email\" />`?"
    options: ["`formData.get('email')`","`formData.email`","`event.target.email`","`useState('email')`"]
    answer: 0
exercise:
  example: ex-form-action
  title: Ein Newsletter-Formular
  task: |-
    Das Formular nutzt noch `onSubmit`, `preventDefault` und ein kontrolliertes Feld. Stelle es auf eine Form Action um:

    1. Übergib eine Funktion an `<form action={…}>`. Sie bekommt die `FormData`.
    2. Gib dem Feld `name="email"` und lies den Wert mit `formData.get('email')`.
    3. Warte auf `subscribe(email)` und zeige danach **Subscribed: …** in `#message`.

    Den State für das Eingabefeld brauchst du nicht mehr – React leert das Feld nach der Action selbst.
  checks:
    subscribes: "Nach dem Absenden steht **Subscribed: ada@example.com** da"
    resets: Das Eingabefeld ist danach leer
    uses-action: "`<form action={…}>` mit `name=\"email\"`, ohne `onSubmit`"
---

# Form Actions

Bisher hast du Formulare mit `onSubmit`, `e.preventDefault()` und State für jedes Feld gebaut. Seit React 19 geht es einfacher: Du übergibst dem Formular eine **Action** – eine Funktion, die beim Absenden mit den Formulardaten aufgerufen wird.

## Eine Funktion als action

```tsx
function NewTodo() {
  async function addTodo(formData: FormData) {
    const title = String(formData.get('title'));
    await saveTodo(title);
  }

  return (
    <form action={addTodo}>
      <input name="title" />
      <button type="submit">Hinzufügen</button>
    </form>
  );
}
```

- Die Funktion bekommt ein **`FormData`**-Objekt. Jedes Feld mit `name` ist darin enthalten: `formData.get('title')`.
- Kein `preventDefault`: React verhindert das Neuladen der Seite selbst.
- Die Action darf **asynchron** sein. React führt sie als Transition aus – die Seite bleibt bedienbar, während sie läuft.
- Ist die Action fertig, **setzt React das Formular zurück**: Unkontrollierte Felder sind wieder leer bzw. stehen auf ihrem `defaultValue`.

## Kontrolliert oder nicht?

Mit Actions brauchst du für viele Formulare keinen State pro Feld mehr. Die Werte stehen im DOM und kommen beim Absenden über `FormData` an. Kontrollierte Felder (`value` + `onChange`) lohnen sich weiter, wenn du während der Eingabe reagieren willst: Live-Vorschau, Zeichenzähler, Felder ein- und ausblenden.

## Mehrere Buttons

Ein Button kann eine eigene Action haben – praktisch für „Speichern“ und „Löschen“ im selben Formular:

```tsx
<form action={save}>
  <input name="title" />
  <button type="submit">Speichern</button>
  <button type="submit" formAction={remove}>Löschen</button>
</form>
```

## Server Functions

In Frameworks wie Next.js kann eine Action auch eine **Server Function** sein (mit `'use server'` markiert). Dann läuft der Code auf dem Server, und das Formular funktioniert sogar, bevor das JavaScript geladen ist. Das Muster im Client bleibt dasselbe.

::tryit{form-actions}
