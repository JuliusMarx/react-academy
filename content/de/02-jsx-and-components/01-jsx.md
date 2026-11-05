---
title: JSX
minutes: 7
summary: |-
  - JSX ist eine Syntax-Erweiterung für Markup im JavaScript-Code. Vite übersetzt es in normale Funktionsaufrufe.
  - Eine Komponente gibt genau ein Wurzelelement zurück. Mehrere Elemente umschließt du mit einem Fragment `<>…</>`, das nicht im DOM landet.
  - Alle Tags werden geschlossen: `<img />`, `<br />`, `<input />`.
  - Attribute in camelCase, einige heißen anders: `className`, `htmlFor`, `onClick`, `tabIndex`. `aria-*` und `data-*` bleiben wie in HTML.
  - In `{ }` steht ein beliebiger JavaScript-Ausdruck – als Text oder als Attributwert. Bei `style={{ color: 'red' }}` ist das innere Paar ein Objekt.
  - Werte in `{ }` werden automatisch escaped, das schützt vor XSS. Kommentare schreibst du als `{/* … */}`.

  ```tsx
  function Card() {
    return (
      <div className="card">
        <h1>{user.firstName} {user.lastName}</h1>
        <img src={`/avatars/${user.lastName}.png`} alt={user.firstName} />
      </div>
    );
  }
  ```

  > [!NOTE] Anweisungen wie `if` oder `for` sind in `{ }` nicht erlaubt – nur Ausdrücke, die einen Wert ergeben.
quiz:
  - question: "Wie setzt du in JSX eine CSS-Klasse?"
    options: ["`class=\"card\"`","`cssClass=\"card\"`","`className=\"card\"`","`style=\"card\"`"]
    answer: 2
    explanation: "`class` ist in JavaScript ein reserviertes Wort, deshalb heißt das Attribut in JSX `className`."
  - question: "Was darf zwischen geschweiften Klammern `{ }` in JSX stehen?"
    options: ["Nur Variablen","Nur Strings","Auch Anweisungen wie `if` und `for`","Jeder JavaScript-Ausdruck, z. B. `user.name` oder `a + b`"]
    answer: 3
    explanation: "Erlaubt sind Ausdrücke, die einen Wert ergeben. Für Bedingungen nimmst du den ternären Operator oder `&&`."
  - question: "Wie gibst du zwei Elemente nebeneinander zurück, ohne ein zusätzliches `<div>`?"
    options: ["Mit einem Fragment `<>…</>`", "Einfach zwei Tags direkt hintereinander zurückgeben", "Mit zwei `return`-Anweisungen", "Gar nicht"]
    answer: 0
---

# JSX

**JSX** ist eine Syntax-Erweiterung für JavaScript, mit der du Markup direkt im Code schreibst. Vite übersetzt es in normale Funktionsaufrufe. JSX sieht aus wie HTML, folgt aber ein paar eigenen Regeln.

## Regel 1: Ein Wurzelelement

Eine Komponente gibt genau *ein* Element zurück. Brauchst du mehrere, umschließe sie – mit einem `<div>` oder, wenn kein zusätzliches Element im DOM landen soll, mit einem **Fragment**:

```tsx
function Profile() {
  return (
    <>
      <h1>Ada Lovelace</h1>
      <p>Mathematikerin</p>
    </>
  );
}
```

## Regel 2: Alle Tags schließen

Tags ohne Inhalt brauchen einen Schrägstrich: `<img />`, `<br />`, `<input />`.

## Regel 3: camelCase-Attribute

Die meisten Attribute schreibst du in camelCase, einige heißen anders als in HTML:

| HTML | JSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |
| `style="color: red"` | `style={{ color: 'red' }}` |

`aria-*`- und `data-*`-Attribute bleiben wie in HTML.

## JavaScript mit { }

In geschweiften Klammern steht ein beliebiger JavaScript-**Ausdruck**:

```tsx
const user = { firstName: 'Ada', lastName: 'Lovelace', born: 1815 };

function Card() {
  return (
    <div className="card">
      <h1>{user.firstName} {user.lastName}</h1>
      <p>Geboren vor {new Date().getFullYear() - user.born} Jahren</p>
      <img src={`/avatars/${user.lastName}.png`} alt={user.firstName} />
    </div>
  );
}
```

Klammern funktionieren als Text zwischen Tags und als Attributwert. Bei `style={{ … }}` sind es zwei Paare: das äußere für „hier kommt JavaScript“, das innere ist ein Objekt.

> [!NOTE]
> Werte in `{ }` werden automatisch escaped. Ein String mit `<script>` landet als Text auf der Seite, nicht als HTML – das schützt vor XSS.

## Kommentare

```tsx
<div>
  {/* Ein Kommentar in JSX */}
</div>
```

::tryit{jsx-basics}
