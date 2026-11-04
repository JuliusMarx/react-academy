---
title: Die erste Komponente
minutes: 7
quiz:
  - question: "Warum muss ein Komponentenname mit einem Großbuchstaben beginnen?"
    options: ["Das ist nur eine Stilregel", "Sonst hält React `<welcome />` für ein HTML-Element", "Wegen TypeScript", "Damit die Datei gefunden wird"]
    answer: 1
    explanation: "Kleingeschriebene Tags wie `<div>` sind für React HTML-Elemente, großgeschriebene wie `<Welcome />` eigene Komponenten."
  - question: "Wo solltest du eine Komponente definieren?"
    options: ["Auf oberster Ebene einer Datei", "Innerhalb einer anderen Komponente", "In der `index.html`", "Egal, Hauptsache vor der Verwendung"]
    answer: 0
    explanation: "Eine Komponente in einer anderen Komponente wird bei jedem Rendern neu erzeugt. Das ist langsam und lässt ihren State verloren gehen."
exercise:
  example: ex-first-component
  title: Eine eigene Komponente
  task: |-
    1. Lass `Greeting` in `src/Greeting.tsx` ein `<h2 className="greeting">` mit dem Text **Hello from my component!** zurückgeben.
    2. Ändere die Überschrift in `App.tsx` auf **My first app**.
    3. Zeige `Greeting` in `App` zweimal an.
  checks:
    greeting-renders: "`Greeting` zeigt `h2.greeting` mit dem richtigen Text"
    heading: Die Überschrift lautet **My first app**
    used-twice: Die App zeigt `Greeting` genau zweimal
---

# Die erste Komponente

Eine **Komponente** ist eine JavaScript-Funktion, die JSX zurückgibt. Mehr braucht es nicht.

## Komponente schreiben

```tsx
function Welcome() {
  return <p>Willkommen in der React Academy!</p>;
}
```

Zwei Regeln:

1. Der Name beginnt mit einem **Großbuchstaben**. `<Welcome />` ist eine Komponente, `<welcome />` hielte React für ein (unbekanntes) HTML-Element.
2. Die Funktion gibt **JSX** zurück – oder `null`, wenn nichts angezeigt werden soll.

## Komponente verwenden

Eine Komponente verwendest du wie ein HTML-Tag – so oft du willst:

```tsx
export default function App() {
  return (
    <main>
      <h1>Komponenten</h1>
      <Welcome />
      <Welcome />
    </main>
  );
}
```

Gibt eine Komponente mehrere Zeilen JSX zurück, setzt du sie in runde Klammern. Ohne die Klammern würde `return` am Zeilenende stehen bleiben und nichts zurückgeben.

## Komponenten in eigene Dateien

Größere Komponenten bekommen eine eigene Datei und werden exportiert:

```tsx
// Avatar.tsx
export default function Avatar() {
  return <img src="/ada.png" alt="Ada Lovelace" width={64} height={64} />;
}
```

```tsx
// App.tsx
import Avatar from './Avatar';
```

- **Default-Export** (`export default`): eine Hauptkomponente pro Datei, beim Import frei benennbar.
- **Benannter Export** (`export function Avatar`): beliebig viele pro Datei, Import mit `import { Avatar } from './Avatar'`.

Beides ist üblich – wichtig ist, dass du in einem Projekt einheitlich bleibst.

> [!WARNING]
> Definiere Komponenten nie *innerhalb* anderer Komponenten. Sie würden bei jedem Rendern neu erzeugt – React sieht dann jedes Mal eine „neue“ Komponente und verwirft ihren State.

::tryit{first-component}
