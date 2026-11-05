---
title: ARIA und IDs
minutes: 9
summary: |-
  - ARIA ergänzt Rollen (`role`), Zustände und Eigenschaften (`aria-*`) für Screenreader. In JSX schreibst du `aria-*` wie in HTML, mit Bindestrich: `aria-expanded={open}`.
  - Erste Regel: Gibt es ein natives Element, nimm es. ARIA ändert nur, was angesagt wird – Fokus und Tastatur musst du selbst bauen. „No ARIA is better than bad ARIA.“
  - Nützlich: `aria-label` für Icon-Buttons, `aria-describedby` für Hinweise und Fehler, `aria-expanded` für Auf- und Zuklappen, `aria-invalid` für fehlerhafte Felder, `aria-hidden` für dekorative Icons.
  - `useId()` erzeugt eine eindeutige ID pro Komponenteninstanz – für `htmlFor`, `aria-describedby` und Co. Feste IDs wie `"email"` kollidieren, sobald die Komponente zweimal auf der Seite steht.
  - Für mehrere IDs einmal `useId()` aufrufen und anhängen: `` `${id}-hint` ``. Nicht für `key`s verwenden und nicht auf das Format verlassen.
  - `eslint-plugin-jsx-a11y` findet viele Fehler schon im Editor: fehlendes `alt`, Labels ohne Feld, `onClick` auf `<div>`.

  ```tsx
  function PasswordField() {
    const hintId = useId();
    return (
      <>
        <label>
          Passwort <input type="password" aria-describedby={hintId} />
        </label>
        <p id={hintId}>Mindestens 12 Zeichen.</p>
      </>
    );
  }
  ```
quiz:
  - question: "Warum ist `<label htmlFor=\"email\">` in einer wiederverwendbaren Komponente ein Problem?"
    options: ["`htmlFor` funktioniert nur mit `useId`","Labels dürfen keine festen Werte haben","Steht die Komponente zweimal auf der Seite, gibt es die ID doppelt – das zweite Label zeigt auf das falsche Feld","Gar nicht, IDs dürfen doppelt vorkommen"]
    answer: 2
    explanation: "IDs müssen auf der Seite eindeutig sein. `useId()` erzeugt pro Instanz eine eigene."
  - question: "Was passiert, wenn du einem `<div>` `role=\"button\"` gibst?"
    options: ["Nichts, `role` ist in JSX nicht erlaubt","Er verhält sich genau wie ein `<button>`","React wirft einen Fehler","Er wird angesagt wie ein Button – fokussierbar und per Tastatur bedienbar wird er dadurch aber nicht"]
    answer: 3
    explanation: "ARIA ändert nur die Semantik. Für `tabIndex={0}` und Enter/Leertaste musst du selbst sorgen – oder gleich `<button>` nehmen."
  - question: "Wofür ist `useId()` nicht gedacht?"
    options: ["Für `key`s in Listen","Für `htmlFor` und `id`","Für `aria-describedby`","Für `aria-labelledby`"]
    answer: 0
    explanation: "Keys kommen aus den Daten. `useId` ist für IDs gedacht, die Elemente miteinander verknüpfen."
exercise:
  example: ex-text-field
  title: Ein barrierefreies Eingabefeld
  task: |-
    `TextField` steht zweimal im Formular – mit der festen ID `"field"` zeigen beide Labels auf das erste Feld. Hinweis und Fehler sieht man nur, ein Screenreader sagt sie nicht an.

    1. Erzeuge die ID mit `useId` und verbinde Label und Feld darüber.
    2. Verknüpfe den Hinweis mit `aria-describedby`.
    3. Gibt es einen Fehler, bekommt das Feld `aria-invalid` und `aria-describedby` zeigt auf Hinweis **und** Fehler (IDs durch Leerzeichen getrennt).

    Zum Ausprobieren: **Sign up** mit einer E-Mail ohne `@` zeigt den Fehler.
  checks:
    label-linked: Beide Felder haben eine eigene ID und genau ein Label
    hint-described: "`aria-describedby` zeigt auf den Hinweis"
    error-invalid: Mit Fehler ist das Feld `aria-invalid` und beschreibt auch den Fehler
---

# ARIA und IDs

Native Elemente reichen nicht immer: Ein Icon-Button hat keinen Text, ein Hinweis unter dem Feld gehört zum Feld, ein Menü ist auf- oder zugeklappt. Das beschreibt **ARIA** (*Accessible Rich Internet Applications*) – ein Satz von Attributen für Screenreader und andere Hilfsmittel.

## ARIA in JSX

ARIA besteht aus Rollen (`role`), Zuständen und Eigenschaften (`aria-*`). Anders als die meisten Attribute schreibst du `aria-*` in JSX genau wie in HTML, mit Bindestrich:

```tsx
<button aria-label="Schließen" onClick={onClose}>
  <XIcon aria-hidden="true" />
</button>

<button aria-expanded={open} aria-controls="filters" onClick={() => setOpen(!open)}>
  Filter
</button>
<div id="filters" hidden={!open}>…</div>
```

Boolesche Werte wie `aria-expanded={open}` rendert React als `"true"` oder `"false"`.

| Attribut | Wofür |
|---|---|
| `aria-label` | Name, wenn kein sichtbarer Text da ist (Icon-Buttons) |
| `aria-labelledby` | Name aus einem anderen Element, z. B. der Überschrift eines Dialogs |
| `aria-describedby` | Zusätzliche Beschreibung: Hinweise, Fehlermeldungen |
| `aria-expanded` | Auf- oder zugeklappt (Menüs, Akkordeons) |
| `aria-current="page"` | Der aktuelle Link in einer Navigation |
| `aria-invalid` | Feld mit ungültigem Wert |
| `aria-hidden="true"` | Vor Screenreadern verstecken – nur für Dekoratives, nie für Fokussierbares |

## No ARIA is better than bad ARIA

So heißt ein Grundsatz der W3C-Leitfäden für ARIA. Denn ARIA ändert nur, was **angesagt** wird – nicht, wie sich ein Element **verhält**:

```tsx
// ✗ Wird als Button angesagt, ist aber nicht per Tab erreichbar und ignoriert Enter
<div role="button" onClick={save}>Speichern</div>

// ✓ Kann alles von selbst
<button onClick={save}>Speichern</button>
```

Eine Rolle ist ein Versprechen: Wer `role="tab"` schreibt, muss auch die Pfeiltasten unterstützen, die Nutzer bei Tabs erwarten. Falsches ARIA ist schlimmer als keins, weil es Screenreader-Nutzern etwas anderes erzählt, als die Seite tut. Deshalb:

1. Natives Element nehmen, wenn es eins gibt.
2. ARIA nur ergänzen, wo HTML nicht reicht.
3. Für komplexe Widgets (Tabs, Combobox, Menü) den passenden Abschnitt im [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) nachlesen – oder eine Headless-Bibliothek wie Radix UI oder React Aria nehmen.

## IDs mit useId

`htmlFor`, `aria-labelledby` und `aria-describedby` verweisen per ID auf andere Elemente. Feste IDs gehen in Komponenten schief: Steht `<PasswordField />` zweimal auf der Seite, gibt es jede ID doppelt. `useId()` erzeugt eine eindeutige ID pro Instanz:

```tsx
import { useId } from 'react';

function PasswordField() {
  const hintId = useId();
  return (
    <>
      <label>
        Passwort <input type="password" aria-describedby={hintId} />
      </label>
      <p id={hintId}>Mindestens 12 Zeichen.</p>
    </>
  );
}
```

Brauchst du mehrere IDs, ruf `useId()` einmal auf und häng etwas an:

```tsx
const id = useId();

<label htmlFor={`${id}-name`}>Name</label>
<input id={`${id}-name`} />
<label htmlFor={`${id}-city`}>Ort</label>
<input id={`${id}-city`} />
```

- `useId` ist ein Hook: nur oben in der Komponente aufrufen, nicht in Schleifen.
- Nicht für `key`s in Listen – die kommen aus den Daten.
- Verlass dich nicht auf das Format. Es hat sich schon geändert (zuletzt in React 19.2 zu `_r_…_`). Mit Server-Rendering sorgt `useId` dafür, dass Server und Browser dieselbe ID erzeugen.

## eslint-plugin-jsx-a11y

Viele Fehler findet ein Linter, bevor die App überhaupt läuft:

```bash
npm install -D eslint-plugin-jsx-a11y
```

```js
// eslint.config.js
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  // … deine übrigen Regeln
  jsxA11y.flatConfigs.recommended,
];
```

Typische Meldungen: `alt-text` (Bild ohne `alt`), `label-has-associated-control` (Label ohne Feld), `click-events-have-key-events` und `no-static-element-interactions` (`onClick` auf `<div>`), `aria-props` (vertippte `aria-*`-Attribute).

> [!NOTE]
> Stand November 2026 ist Version 6.10 aktuell, offiziell unterstützt bis ESLint 9. Mit ESLint 10 meldet npm einen Peer-Dependency-Konflikt.

Der Linter sieht nur den Code, nicht die fertige Seite. Ob Fokus, Kontrast und Ansagen stimmen, prüfst du im Browser und mit Tests – mehr dazu in den nächsten Lektionen.
