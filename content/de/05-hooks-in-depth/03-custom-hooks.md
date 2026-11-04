---
title: Eigene Hooks
minutes: 8
quiz:
  - question: "Was macht eine Funktion zu einem eigenen Hook?"
    options: ["Sie ist mit `@hook` markiert","Sie liegt im Ordner `hooks/`","Ihr Name beginnt mit `use` und sie ruft andere Hooks auf","Sie gibt JSX zurück"]
    answer: 2
  - question: "Zwei Komponenten rufen `useWindowWidth()` auf. Teilen sie sich denselben State?"
    options: ["Ja, eigene Hooks sind global","Nur in StrictMode","Nur wenn sie Geschwister sind","Nein, jeder Aufruf hat seinen eigenen State – geteilt wird nur die Logik"]
    answer: 3
exercise:
  example: ex-custom-hook
  title: useLocalStorage
  task: |-
    Schreibe in `src/useLocalStorage.ts` einen Hook, der wie `useState` funktioniert, sich den Wert aber in `localStorage` merkt:

    1. Starte mit dem gespeicherten Wert (`JSON.parse`), falls es einen gibt, sonst mit `initialValue`. Übergib `useState` dafür eine Funktion, damit `localStorage` nur beim ersten Rendern gelesen wird.
    2. Speichere den Wert bei jeder Änderung mit `JSON.stringify` – in einem Effekt.
  checks:
    initial-value: Ohne gespeicherten Wert gilt `initialValue`
    stores: Neue Werte landen als JSON in `localStorage`
    reads-stored: Ein gespeicherter Wert wird beim Start gelesen
---

# Eigene Hooks

Wenn mehrere Komponenten dieselbe Logik brauchen – „bin ich online?“, „wie breit ist das Fenster?“ –, lagerst du sie in einen **eigenen Hook** aus.

## Einen Hook schreiben

Ein eigener Hook ist eine Funktion, deren Name mit **`use`** beginnt und die andere Hooks verwendet:

```ts
import { useEffect, useState } from 'react';

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}
```

Verwendet wird er wie jeder eingebaute Hook:

```tsx
function SizeInfo() {
  const width = useWindowWidth();
  return <p>{width < 600 ? 'Klein' : 'Groß'}</p>;
}
```

Die Komponente muss nichts mehr über Event-Listener und Cleanup wissen – sie sagt nur, *was* sie braucht.

## Logik teilen, nicht State

Jeder Aufruf eines Hooks hat **seinen eigenen State**. Rufen zwei Komponenten `useWindowWidth()` auf, hat jede ihre eigene Variable `width` und ihren eigenen Listener. Geteilt wird nur der Code.

Sollen Komponenten wirklich *denselben* State nutzen, verlagerst du ihn nach oben oder nutzt Context.

## Regeln

- Der Name beginnt mit `use` gefolgt von einem Großbuchstaben: `useOnlineStatus`, `useLocalStorage`. Daran erkennen React und der Linter, dass die Hook-Regeln gelten.
- Für Hooks gelten dieselben Regeln wie für eingebaute: nur auf oberster Ebene aufrufen, nicht in Bedingungen oder Schleifen.
- Eine Funktion, die keine Hooks aufruft, braucht kein `use` – dann ist sie eine ganz normale Hilfsfunktion.

## Gute Kandidaten

- Abos auf Browser-Ereignisse: `useOnlineStatus`, `useMediaQuery`
- Wiederkehrende State-Muster: `useToggle`, `useLocalStorage`
- Daten laden: `useFetch` – in der Praxis meist über eine Bibliothek wie TanStack Query (Kapitel 6)

::tryit{custom-hooks}
