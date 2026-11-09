---
title: useEffect
minutes: 8
summary: |-
  - Effekte synchronisieren eine Komponente mit etwas außerhalb von React: Seitentitel, Timer, Browser-APIs, Verbindungen.
  - React führt den Effekt **nach dem Rendern** aus, wenn das DOM schon aktualisiert ist.
  - Ohne Array läuft er nach jedem Rendern, mit `[]` nur nach dem ersten, mit `[a, b]` zusätzlich, wenn sich `a` oder `b` ändert (Vergleich mit `Object.is`).
  - Ins Array gehört jeder Wert aus der Komponente, den der Effekt liest – sonst arbeitet er mit veralteten Werten. Die ESLint-Regel `react-hooks/exhaustive-deps` hilft dabei.
  - Soll ein Effekt seltener laufen, ändere seinen Code statt des Arrays, z. B. mit `setCount((c) => c + 1)`.
  - Reaktionen auf Aktionen wie Klicks gehören in Event-Handler, nicht in Effekte.

  ```tsx
  useEffect(() => {
    document.title = `${count} Klicks`;
  }, [count]); // Tippen in ein anderes Feld löst den Effekt nicht aus
  ```

  > [!TIP] Schalte `exhaustive-deps` nicht ab, sondern folge ihren Hinweisen.
quiz:
  - question: "Wann läuft ein Effekt mit dem Abhängigkeits-Array `[count]`?"
    options: ["Bei jedem Rendern","Nur beim ersten Rendern","Bevor die Komponente rendert","Nach dem ersten Rendern und immer dann, wenn sich `count` geändert hat"]
    answer: 3
  - question: "Was bedeutet ein leeres Abhängigkeits-Array `[]`?"
    options: ["Der Effekt läuft nur nach dem ersten Rendern (Mount)","Der Effekt läuft nie","Der Effekt läuft bei jedem Rendern","Das ist ein Fehler"]
    answer: 0
  - question: "Wofür ist `useEffect` gedacht?"
    options: ["Um Werte aus Props und State zu berechnen", "Um eine Komponente mit etwas außerhalb von React zu synchronisieren", "Um auf Klicks zu reagieren", "Um State zu initialisieren"]
    answer: 1
    explanation: "Berechnungen gehören ins Rendern, Reaktionen auf Klicks in Event-Handler. Effekte sind für Dinge wie Timer, Browser-APIs, Netzwerkverbindungen oder externe Bibliotheken."
exercise:
  example: ex-document-title
  title: Der Seitentitel
  task: |-
    Halte den Titel des Browser-Tabs mit dem Zähler synchron: **Clicked 0 times**, **Clicked 1 times** …

    Verwende `useEffect` mit dem passenden Abhängigkeits-Array – Tippen im Namensfeld soll den Effekt nicht auslösen.
  checks:
    initial-title: Der Titel lautet anfangs **Clicked 0 times**
    updates-title: Nach zwei Klicks lautet er **Clicked 2 times**
    uses-effect: "Der Titel wird in `useEffect` mit `[count]` gesetzt"
---

# useEffect

Komponenten sollen **rein** sein: Sie berechnen aus Props und State ihr JSX – mehr nicht. Manchmal muss eine Komponente aber etwas *außerhalb* von React anstoßen: den Seitentitel setzen, einen Timer starten, auf Fenstergrößen hören, eine Verbindung öffnen. Dafür gibt es **Effekte**.

## Einen Effekt anlegen

```tsx
import { useEffect, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `${count} Klicks`;
  });

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

React führt die Funktion **nach dem Rendern** aus – wenn das DOM schon aktualisiert ist. So bremst der Effekt das Anzeigen nicht aus.

## Das Abhängigkeits-Array

Ohne zweites Argument läuft der Effekt nach *jedem* Rendern. Meist willst du das einschränken:

| Aufruf | Läuft … |
|---|---|
| `useEffect(fn)` | nach jedem Rendern |
| `useEffect(fn, [])` | nur nach dem ersten Rendern (Mount) |
| `useEffect(fn, [a, b])` | nach dem ersten Rendern und wenn sich `a` oder `b` geändert hat |

```tsx
useEffect(() => {
  document.title = `${count} Klicks`;
}, [count]); // Tippen in ein anderes Feld löst den Effekt nicht aus
```

React vergleicht jeden Wert mit dem vom letzten Rendern (`Object.is`). Nur wenn sich einer geändert hat, läuft der Effekt erneut.

## Abhängigkeiten nicht weglassen

In das Array gehört **jeder Wert aus der Komponente**, den der Effekt liest – Props, State und daraus berechnete Variablen. Fehlt einer, arbeitet der Effekt mit veralteten Werten.

> [!TIP]
> Die ESLint-Regel `react-hooks/exhaustive-deps` findet fehlende Abhängigkeiten automatisch. Das aktuelle Vite-Template nutzt statt ESLint den Linter Oxlint, der dieselbe Prüfung als `react/exhaustive-deps` schon mitbringt. Folge ihren Hinweisen, statt sie abzuschalten.

Willst du, dass ein Effekt *seltener* läuft, ändere den Code des Effekts – nicht das Array. Oft hilft eine Updater-Funktion wie `setCount((c) => c + 1)`, dann muss `count` nicht in die Liste.

## Effekte sind keine Event-Handler

Ein Effekt beschreibt, womit eine Komponente **synchron bleiben** soll – solange sie angezeigt wird. Was als Reaktion auf eine bestimmte Aktion passiert (Formular abschicken, Produkt in den Warenkorb legen), gehört in den Event-Handler.

::tryit{use-effect}
