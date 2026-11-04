---
title: Transitions und verzögerte Werte
minutes: 8
quiz:
  - question: "Was macht `useDeferredValue(query)`?"
    options: ["Es verzögert jede Eingabe um eine Sekunde","Es macht die Komponente asynchron","Es speichert `query` in `localStorage`","Es liefert eine Version von `query`, die bei teuren Updates hinterherhinken darf – die Eingabe selbst bleibt flüssig"]
    answer: 3
  - question: "Wann nimmst du `useTransition` statt `useDeferredValue`?"
    options: ["Wenn du den State-Setter selbst aufrufst und die Änderung als nicht dringend markieren willst", "Nie, beide sind gleich", "Nur für Netzwerkanfragen", "Nur in Klassenkomponenten"]
    answer: 0
  - question: "Warum hilft `useDeferredValue` nur zusammen mit `memo` bei der langsamen Liste?"
    options: ["Weil `memo` die Liste schneller rendert", "Damit die Liste beim dringenden Rendern mit dem alten Wert übersprungen wird – sonst rendert sie trotzdem jedes Mal", "Das ist nicht nötig", "Weil `useDeferredValue` sonst einen Fehler wirft"]
    answer: 1
exercise:
  example: ex-deferred
  title: Eine flüssige Suche
  task: |-
    Die Ergebnisliste braucht für jedes Rendern rund 150 ms – das Eingabefeld hakt beim Tippen.

    1. Gib `SlowResults` eine verzögerte Version der Suche: `useDeferredValue(query)`.
    2. Solange die Liste noch einen älteren Suchbegriff zeigt, bekommt `<div id="list">` die Klasse `stale`.
  checks:
    filters: Die Suche **ber** zeigt Berlin und Bern
    stale-class: "`#list` bekommt `stale`, solange die Liste veraltet ist"
    uses-deferred: "`SlowResults` bekommt den Wert aus `useDeferredValue`"
---

# Transitions und verzögerte Werte

Manche Updates sind teuer: eine lange Liste filtern, ein Diagramm neu zeichnen, eine Seite mit vielen Komponenten wechseln. Normalerweise rendert React jedes Update sofort und vollständig – während dieser Zeit reagiert die Seite nicht. Mit **Transitions** markierst du Updates als **nicht dringend**. React erledigt dann zuerst das Dringende (z. B. das Eingabefeld) und rendert den Rest im Hintergrund, unterbrechbar.

## useDeferredValue

```tsx
import { useDeferredValue, useState } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SlowList query={deferredQuery} />
      </div>
    </>
  );
}
```

- Beim Tippen rendert React zuerst mit dem **alten** `deferredQuery` – das Eingabefeld aktualisiert sich sofort.
- Danach rendert React im Hintergrund mit dem neuen Wert. Tippt man weiter, wird dieses Rendern abgebrochen und neu begonnen.
- Ist `query !== deferredQuery`, zeigt die Liste noch alte Ergebnisse – ein guter Moment, sie etwas auszugrauen.

> [!WARNING]
> Die langsame Komponente muss mit `memo` umhüllt sein (oder der React Compiler aktiv). Sonst rendert sie beim dringenden Rendern trotzdem mit – nur eben mit dem alten Wert, und der Vorteil ist weg.

## useTransition

Rufst du den State-Setter selbst auf, markierst du die Änderung mit **`startTransition`**:

```tsx
const [tab, setTab] = useState('home');
const [isPending, startTransition] = useTransition();

<button onClick={() => startTransition(() => setTab('reports'))}>Berichte</button>
{isPending && <Spinner />}
```

Während die neue Seite rendert, bleibt die alte bedienbar, und `isPending` zeigt, dass etwas passiert. Klickt man in der Zwischenzeit woanders hin, verwirft React das angefangene Rendern.

## Welches wann?

| Situation | Werkzeug |
|---|---|
| Du rufst den Setter selbst auf (Tab-Wechsel, Navigation) | `useTransition` / `startTransition` |
| Der Wert kommt von außen, z. B. als Prop oder aus einer Eingabe | `useDeferredValue` |
| Daten laden, ohne den alten Inhalt durch ein Fallback zu ersetzen | `startTransition` (Kapitel 6) |

::tryit{transitions}
