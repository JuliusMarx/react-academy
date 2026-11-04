---
title: Objekte und Arrays im State
minutes: 8
quiz:
  - question: "Warum aktualisiert `items.push(x); setItems(items);` die Anzeige nicht?"
    options: ["`push` ist in React verboten", "Es ist dasselbe Array – React sieht keine Änderung und rendert nicht neu", "Weil `setItems` asynchron ist", "Es funktioniert"]
    answer: 1
    explanation: "React vergleicht die Referenz. Erzeuge ein neues Array, z. B. `setItems([...items, x])`."
  - question: "Wie entfernst du das Element mit der ID 3 aus dem State `todos`?"
    options: ["`todos.splice(2, 1)`", "`setTodos(todos.filter((t) => t.id !== 3))`", "`delete todos[3]`", "`setTodos(todos.pop())`"]
    answer: 1
  - question: "Wie änderst du nur `city` im State-Objekt `user`?"
    options: ["`user.city = 'Paris'`", "`setUser({ city: 'Paris' })`", "`setUser({ ...user, city: 'Paris' })`", "`setUser(user, 'Paris')`"]
    answer: 2
    explanation: "Der Setter ersetzt das ganze Objekt. Mit dem Spread-Operator übernimmst du die übrigen Felder."
exercise:
  example: ex-shopping-list
  title: Eine Einkaufsliste
  task: |-
    Die Liste wird angezeigt, aber die drei Funktionen funktionieren nicht:

    1. `addItem` verändert das Array direkt – deshalb bemerkt React nichts. Erzeuge stattdessen ein neues Array.
    2. `toggleItem` dreht `bought` des passenden Eintrags um, ohne die vorhandenen Objekte zu verändern.
    3. `removeItem` entfernt den Eintrag.
  checks:
    adds-item: Ein neuer Eintrag erscheint am Ende der Liste
    toggles-item: Das Häkchen schaltet die Klasse `bought` an und aus
    removes-item: "**Remove** entfernt genau diesen Eintrag"
---

# Objekte und Arrays im State

State kann jeder Wert sein – auch Objekte und Arrays. Dabei gilt eine wichtige Regel: **State nie verändern, sondern ersetzen.**

## Warum unveränderlich?

React entscheidet anhand der **Referenz**, ob sich State geändert hat. Veränderst du ein Objekt direkt und übergibst es erneut, ist es für React dasselbe Objekt – es passiert nichts:

```tsx
user.city = 'Paris'; // ✗ verändert das Objekt
setUser(user);       // ✗ dieselbe Referenz – kein neues Rendern
```

Erzeuge stattdessen eine Kopie mit den Änderungen.

## Objekte aktualisieren

Mit dem **Spread-Operator** übernimmst du alle Felder und überschreibst einzelne:

```tsx
const [user, setUser] = useState({ name: 'Ada', city: 'London' });

setUser({ ...user, city: 'Paris' });
```

Bei verschachtelten Objekten musst du jede Ebene kopieren, die sich ändert:

```tsx
setUser({ ...user, address: { ...user.address, city: 'Paris' } });
```

## Arrays aktualisieren

Statt `push`, `splice` oder `arr[i] = …` verwendest du Methoden, die ein **neues Array** zurückgeben:

| Aktion | Statt … | Verwende |
|---|---|---|
| Hinzufügen | `push` | `[...items, neu]` |
| Entfernen | `splice` | `items.filter((i) => i.id !== id)` |
| Ändern | `items[i].done = true` | `items.map((i) => (i.id === id ? { ...i, done: true } : i))` |
| Sortieren | `sort()` direkt | `items.toSorted(…)` oder `[...items].sort(…)` |

```tsx
function toggle(id: number) {
  setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
}
```

> [!TIP]
> `toSorted`, `toReversed` und `with` sind neue Array-Methoden, die nie das Original verändern – ideal für State.

## Abgeleitete Werte nicht speichern

Was sich aus dem State berechnen lässt, gehört nicht selbst in den State:

```tsx
const [todos, setTodos] = useState<Todo[]>([]);
const openCount = todos.filter((t) => !t.done).length; // bei jedem Rendern neu berechnet
```

So kann `openCount` nie veralten.

::tryit{state-objects-arrays}
