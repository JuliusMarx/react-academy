---
title: Listen und key
minutes: 8
quiz:
  - question: "Wozu dient der `key` bei Listenelementen?"
    options: ["React erkennt daran, welches Element welches ist, wenn sich die Liste ändert","Er wird als HTML-Attribut ausgegeben","Er sortiert die Liste","Er ist nur für TypeScript wichtig"]
    answer: 0
  - question: "Was ist der beste `key`?"
    options: ["`Math.random()`","Eine stabile, eindeutige ID aus den Daten","Der Index aus `map`","Der angezeigte Text"]
    answer: 1
    explanation: "Zufallswerte ändern sich bei jedem Rendern, der Index ändert sich beim Sortieren oder Löschen. Eine ID bleibt stabil."
exercise:
  example: ex-lists
  title: Eine Produktliste
  task: |-
    1. Gib für jedes Produkt ein `<li>` in `<ul id="products">` aus, mit Name und Preis, z. B. **Coffee – 3.50 €**. Vergiss den `key` nicht.
    2. Nicht vorrätige Produkte zeigen zusätzlich `<span className="sold-out">sold out</span>`.
    3. Ist die Liste leer (Button **Clear**), zeige stattdessen `<p id="empty">No products</p>`.
  checks:
    renders-items: Drei Listeneinträge mit Name und Preis
    sold-out: Nur Tea ist als **sold out** markiert
    empty-state: Nach **Clear** erscheint **No products**
---

# Listen und key

Listen erzeugst du in React mit der Array-Methode **`map`**: Aus jedem Datenelement wird ein JSX-Element.

## Listen mit map

```tsx
const fruits = [
  { id: 1, name: 'Apfel' },
  { id: 2, name: 'Banane' },
];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit.id}>{fruit.name}</li>
      ))}
    </ul>
  );
}
```

Zum Filtern nimmst du vorher `filter`:

```tsx
{fruits.filter((f) => f.inStock).map((f) => <li key={f.id}>{f.name}</li>)}
```

## Warum key?

Ändert sich eine Liste – ein Eintrag kommt dazu, wird gelöscht oder die Reihenfolge ändert sich –, muss React wissen, welches Element welches ist. Daran erkennt React, was es wiederverwenden kann und wo es State (z. B. den Inhalt eines Eingabefelds) hingehört.

- Der `key` muss unter Geschwistern **eindeutig** sein.
- Er muss **stabil** bleiben – bei jedem Rendern derselbe Wert für dasselbe Element.
- Am besten eignet sich eine **ID aus den Daten**.

> [!WARNING]
> Der Index (`map((f, i) => <li key={i}>`) funktioniert nur bei Listen, die sich nie umsortieren oder ändern. Sonst „wandert“ State zum falschen Element. Probier es im Beispiel aus: Notiz eintippen, umdrehen, dann mit `key={index}` wiederholen.

`Math.random()` als key ist noch schlimmer: Dann baut React bei jedem Rendern alle Elemente neu auf.

## Leere Listen

Kombiniere die Liste mit bedingtem Rendern:

```tsx
{fruits.length === 0 ? <p>Keine Früchte.</p> : <ul>{/* … */}</ul>}
```

::tryit{lists-and-keys}
