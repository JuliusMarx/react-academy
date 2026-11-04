---
title: memo, useMemo und useCallback
minutes: 9
quiz:
  - question: "Wann überspringt eine mit `memo` umhüllte Komponente das Rendern?"
    options: ["Immer", "Wenn alle Props gleich geblieben sind (Vergleich mit `Object.is`)", "Wenn sie keinen State hat", "Nie, `memo` ist nur ein Hinweis für Entwickler"]
    answer: 1
  - question: "Warum hilft `memo` nichts, wenn du `onSelect={() => setSelected(id)}` übergibst?"
    options: ["Pfeilfunktionen sind verboten", "Bei jedem Rendern entsteht eine neue Funktion – die Prop ist also nie gleich", "Weil `setSelected` asynchron ist", "Es hilft doch"]
    answer: 1
    explanation: "Mit `useCallback` behältst du dieselbe Funktion, solange sich ihre Abhängigkeiten nicht ändern."
  - question: "Was macht der React Compiler?"
    options: ["Er übersetzt JSX in HTML", "Er fügt Memoisierung automatisch ein, sodass du `memo`, `useMemo` und `useCallback` meist nicht von Hand brauchst", "Er ersetzt TypeScript", "Er macht Effekte überflüssig"]
    answer: 1
exercise:
  example: ex-memo
  title: Unnötiges Rendern vermeiden
  task: |-
    Bei jedem Tastendruck im Feld **Note** rendert `ProductList` neu, obwohl sich die Liste nicht ändert.

    1. Umhülle `ProductList` mit `memo`.
    2. Halte die gefilterte Liste mit `useMemo` stabil.
    3. Halte `handleSelect` mit `useCallback` stabil.

    Filter und Auswahl müssen weiter funktionieren.
  checks:
    skips-renders: Tippen in **Note** rendert `ProductList` nicht neu
    still-filters: Der Filter **co** zeigt Coffee und Cocoa
    still-selects: Ein Klick auf **Cocoa** wählt Produkt 2 aus
---

# memo, useMemo und useCallback

React ist schnell – meist musst du nichts optimieren. Wird eine Komponente aber spürbar langsam, gibt es drei Werkzeuge, um unnötige Arbeit zu sparen. Sie alle merken sich ein Ergebnis (**Memoisierung**).

## memo: Rendern überspringen

Rendert eine Komponente neu, rendern normalerweise alle ihre Kinder mit. Mit **`memo`** überspringt ein Kind das Rendern, solange seine Props gleich bleiben:

```tsx
import { memo } from 'react';

const ProductList = memo(function ProductList({ products, onSelect }: Props) {
  // …
});
```

„Gleich“ heißt: Jede Prop wird mit `Object.is` mit der vorherigen verglichen. Bei Zahlen und Strings klappt das von selbst – bei Objekten, Arrays und Funktionen nur, wenn es **dasselbe** Objekt ist.

## useMemo: Werte merken

```tsx
const visible = useMemo(
  () => products.filter((p) => p.name.includes(query)),
  [products, query],
);
```

`useMemo` rechnet nur neu, wenn sich eine Abhängigkeit geändert hat. Das hilft in zwei Fällen:

- Die Berechnung ist **teuer** (z. B. tausende Einträge filtern oder sortieren).
- Das Ergebnis geht an eine `memo`-Komponente und soll **dasselbe Objekt** bleiben.

## useCallback: Funktionen merken

Eine Funktion, die du in einer Komponente definierst, ist bei jedem Rendern eine neue. `useCallback` behält dieselbe Funktion, solange die Abhängigkeiten gleich sind:

```tsx
const handleSelect = useCallback((id: number) => setSelected(id), []);

<ProductList products={visible} onSelect={handleSelect} />
```

`useCallback(fn, deps)` ist dasselbe wie `useMemo(() => fn, deps)`.

## Erst messen, dann optimieren

Memoisierung kostet selbst ein wenig Zeit und macht Code schwerer lesbar. Setze sie gezielt ein, wo du ein Problem gemessen hast – mit dem **Profiler** der React DevTools.

Oft hilft auch eine einfachere Lösung: State weiter nach unten verlagern, damit weniger Komponenten neu rendern, oder Inhalte als `children` übergeben.

## Der React Compiler

Der **React Compiler** analysiert deine Komponenten beim Build und fügt die Memoisierung automatisch ein. In Projekten, die ihn verwenden, brauchst du `memo`, `useMemo` und `useCallback` kaum noch von Hand. Du solltest die drei trotzdem kennen – sie stecken in viel bestehendem Code, und der Compiler setzt dieselben Ideen um.

> [!NOTE]
> Der Compiler funktioniert nur mit Code, der die Regeln von React einhält: reine Komponenten, kein Verändern von Props und State, Hooks nur auf oberster Ebene. Noch ein Grund, sich daran zu halten.

::tryit{memo}
