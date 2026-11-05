---
title: Events
minutes: 7
summary: |-
  - Auf Benutzeraktionen reagierst du mit Event-Handlern, die du als Prop wie `onClick`, `onChange` oder `onSubmit` übergibst.
  - Übergib die Funktion selbst: `onClick={handleClick}`. Für Argumente nimmst du eine Pfeilfunktion: `onClick={() => remove(item.id)}`.
  - Namenskonvention: Handler heißen `handle` + Ereignis, die Props `on` + Ereignis.
  - Jeder Handler bekommt ein Event-Objekt. `e.preventDefault()` verhindert z. B., dass ein Formular die Seite neu lädt.
  - Events steigen im Baum nach oben (Bubbling). `e.stopPropagation()` hält das an.
  - Eigene Komponenten können Handler als Props entgegennehmen – so entscheidet die Elternkomponente, was passiert.

  ```tsx
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get('city'));
  }

  <form onSubmit={handleSubmit}>
    <input name="city" />
    <button type="submit">Senden</button>
  </form>
  ```

  > [!WARNING] `onClick={handleClick()}` ruft die Funktion sofort beim Rendern auf, nicht erst beim Klick.
quiz:
  - question: "Welche Schreibweise ruft `handleClick` erst beim Klick auf?"
    options: ["`onClick={handleClick()}`","`onclick=\"handleClick\"`","`onClick={handleClick}`","`onClick=\"handleClick()\"`"]
    answer: 2
    explanation: "Mit Klammern wird die Funktion sofort beim Rendern aufgerufen. Du übergibst die Funktion selbst – oder eine Pfeilfunktion: `onClick={() => remove(id)}`."
  - question: "Wie verhinderst du, dass ein Formular beim Absenden die Seite neu lädt?"
    options: ["`return false` im Handler","Gar nicht","`e.stopPropagation()`","`e.preventDefault()`"]
    answer: 3
---

# Events

Auf Benutzeraktionen reagierst du mit **Event-Handlern**: Funktionen, die du als Prop wie `onClick`, `onChange` oder `onSubmit` übergibst.

## Handler übergeben

```tsx
function Toolbar() {
  function handleClick() {
    alert('Gespeichert!');
  }

  return (
    <>
      <button onClick={handleClick}>Speichern</button>
      <button onClick={() => alert('Gelöscht!')}>Löschen</button>
    </>
  );
}
```

> [!WARNING]
> Übergib die Funktion, rufe sie nicht auf: `onClick={handleClick}` statt `onClick={handleClick()}`. Mit Klammern läuft sie sofort beim Rendern. Brauchst du Argumente, nimm eine Pfeilfunktion: `onClick={() => remove(item.id)}`.

Handler heißen meist `handle` + Ereignis (`handleClick`, `handleSubmit`), die zugehörigen Props `on` + Ereignis.

## Das Event-Objekt

Jeder Handler bekommt ein Event-Objekt. React reicht dabei die gewohnten Eigenschaften und Methoden durch:

```tsx
import type { FormEvent } from 'react';

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault(); // kein Neuladen der Seite
  const data = new FormData(e.currentTarget);
  console.log(data.get('city'));
}

<form onSubmit={handleSubmit}>
  <input name="city" />
  <button type="submit">Senden</button>
</form>
```

## Bubbling

Events steigen im Baum nach oben: Ein Klick auf einen Button löst auch `onClick` der umgebenden Elemente aus. Mit `e.stopPropagation()` hältst du das an.

## Handler als Props

Eigene Komponenten können Handler weiterreichen. So entscheidet die Elternkomponente, was bei einem Klick passiert:

```tsx
function Button({ onPress, children }: { onPress: () => void; children: ReactNode }) {
  return <button onClick={onPress}>{children}</button>;
}

<Button onPress={() => save()}>Speichern</Button>
```

::tryit{events}

> [!NOTE]
> Damit ein Klick etwas *auf der Seite* ändert, braucht die Komponente **State**. Im Beispiel macht das `useState` – darum geht es im nächsten Kapitel.
