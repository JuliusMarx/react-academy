---
title: Formularfelder
minutes: 7
summary: |-
  - Ein kontrolliertes Feld bekommt `value` aus dem State und meldet jede Änderung per `onChange` zurück. So kannst du den Wert sofort anzeigen, prüfen oder zurücksetzen.
  - `<textarea>` und `<select>` funktionieren genauso mit `value`.
  - Bei Checkboxen und Radiobuttons heißt das Attribut `checked`, im Handler liest du `e.target.checked`.
  - Gültigkeit ist ein abgeleiteter Wert: Berechne sie beim Rendern, statt sie in eigenem State zu speichern.
  - Brauchst du den Wert erst beim Absenden, reicht ein unkontrolliertes Feld mit `defaultValue` und `FormData`.

  ```tsx
  function NameForm() {
    const [name, setName] = useState('');
    return (
      <label>
        Name <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
    );
  }

  const isValid = name.trim().length >= 2 && email.includes('@');
  ```

  > [!WARNING] Ein Feld mit `value`, aber ohne `onChange` ist schreibgeschützt.
quiz:
  - question: "Was macht ein Eingabefeld „kontrolliert“?"
    options: ["Ein `name`-Attribut","Das Attribut `controlled`","Ein `<form>` darum herum","`value` kommt aus dem State und `onChange` aktualisiert ihn"]
    answer: 3
  - question: "Welche Eigenschaft liest du bei einer Checkbox im `onChange`?"
    options: ["`e.target.checked`","`e.target.value`","`e.target.selected`","`e.checked`"]
    answer: 0
exercise:
  example: ex-signup-form
  title: Ein Anmeldeformular
  task: |-
    1. Lege State für Name und E-Mail an und mache beide Felder kontrolliert (`value` + `onChange`).
    2. `#preview` zeigt beim Tippen **Hello, Ada!** (leer: **Hello, stranger!**).
    3. Der Button ist deaktiviert, bis der Name mindestens 2 Zeichen hat und die E-Mail ein **@** enthält. Berechne das direkt beim Rendern – ohne zusätzlichen State.
    4. Nach dem Absenden zeigt `#thanks` **Thanks, Ada!** und beide Felder sind wieder leer.
  checks:
    live-preview: Die Vorschau zeigt den Namen beim Tippen
    disabled-when-invalid: Bei ungültigen Eingaben ist der Button deaktiviert
    enabled-when-valid: Bei gültigen Eingaben ist der Button aktiv
    submit-resets: Nach dem Absenden erscheint der Dank und die Felder sind leer
---

# Formularfelder

Bei Eingabefeldern hast du zwei Möglichkeiten: Der Browser verwaltet den Wert (**unkontrolliert**), oder React tut es (**kontrolliert**).

## Kontrollierte Felder

Ein kontrolliertes Feld bekommt seinen Wert aus dem State und meldet jede Änderung zurück:

```tsx
function NameForm() {
  const [name, setName] = useState('');

  return (
    <>
      <label>
        Name <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <p>Hallo, {name || 'Fremde:r'}!</p>
    </>
  );
}
```

Weil der Wert im State liegt, kannst du ihn sofort verwenden: live anzeigen, prüfen, umformen oder per Button zurücksetzen (`setName('')`).

> [!WARNING]
> Ein Feld mit `value`, aber ohne `onChange` ist schreibgeschützt – React setzt jede Eingabe sofort wieder auf den State zurück.

## Andere Feldtypen

```tsx
<textarea value={text} onChange={(e) => setText(e.target.value)} />

<select value={plan} onChange={(e) => setPlan(e.target.value)}>
  <option value="free">Free</option>
  <option value="pro">Pro</option>
</select>

<input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
```

Bei Checkboxen und Radiobuttons heißt das Attribut **`checked`**, nicht `value`.

## Validierung beim Rendern

Ob eine Eingabe gültig ist, ist ein **abgeleiteter Wert** – du berechnest ihn einfach:

```tsx
const isValid = name.trim().length >= 2 && email.includes('@');

<button type="submit" disabled={!isValid}>Anmelden</button>
```

## Unkontrollierte Felder

Brauchst du den Wert erst beim Absenden, reicht oft ein unkontrolliertes Feld mit `defaultValue` und `FormData`:

```tsx
function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
  e.preventDefault();
  const email = new FormData(e.currentTarget).get('email');
}

<form onSubmit={handleSubmit}>
  <input name="email" defaultValue="" />
</form>
```

Moderne Formulare mit `<form action>` und `useActionState` lernst du in Kapitel 8 kennen.

::tryit{controlled-inputs}
