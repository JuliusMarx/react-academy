---
title: Code-Splitting mit lazy
minutes: 7
summary: |-
  - Code-Splitting teilt den Build in mehrere Dateien: Selten gebrauchte Teile lädt der Browser erst, wenn man sie braucht.
  - `import('./Editor')` ist ein dynamischer Import – Vite legt den Editor in eine eigene Datei. Sie muss die Komponente als Default-Export bereitstellen.
  - `lazy` macht daraus eine Komponente, die beim ersten Rendern suspendiert, bis der Code da ist. Die nächste `<Suspense>`-Grenze zeigt solange ihr Fallback.
  - Es lohnt sich für ganze Seiten, große Komponenten mit schweren Abhängigkeiten (Editoren, Diagramme, Karten) und selten gezeigte Teile wie Dialoge.
  - Kleine Komponenten aufzuteilen bringt nichts – jede Datei ist eine eigene Anfrage.

  ```tsx
  const Editor = lazy(() => import('./Editor'));

  function Post() {
    const [editing, setEditing] = useState(false);
    return (
      <>
        <button onClick={() => setEditing(true)}>Bearbeiten</button>
        {editing && (
          <Suspense fallback={<p>Editor wird geladen …</p>}>
            <Editor />
          </Suspense>
        )}
      </>
    );
  }
  ```

  > [!WARNING] `lazy` gehört auf die oberste Ebene des Moduls, nie in eine Komponente – sonst entsteht bei jedem Rendern eine neue Komponente.
quiz:
  - question: "Was bewirkt `const Editor = lazy(() => import('./Editor'))`?"
    options: ["Der Editor rendert langsamer","Der Editor wird beim Build entfernt","Der Code des Editors wird erst geladen, wenn die Komponente zum ersten Mal gerendert wird","Der Editor wird im Hintergrund vorgerendert"]
    answer: 2
  - question: "Was brauchst du zusätzlich, wenn du eine `lazy`-Komponente renderst?"
    options: ["Nichts","Einen `useEffect`","Einen Router","Eine `<Suspense>`-Grenze mit einem Fallback darüber"]
    answer: 3
exercise:
  example: ex-lazy
  title: Ein Diagramm nachladen
  task: |-
    Das Diagramm ist „schwer“ und wird nur selten gebraucht. Lade es erst, wenn es angezeigt wird:

    1. Ersetze den statischen Import durch `const Chart = lazy(() => import('./Chart'))`.
    2. Umhülle `<Chart />` mit `<Suspense>` und dem Fallback `<p id="loading">Loading chart …</p>`.
  checks:
    hidden-at-first: Anfangs ist kein Diagramm zu sehen
    shows-chart: Nach **Show chart** erscheint das Diagramm
    lazy-import: "Geladen wird mit `lazy()` und `<Suspense>`, ohne statischen Import"
---

# Code-Splitting mit lazy

Beim Build packt Vite deine App in JavaScript-Dateien, die der Browser laden muss, bevor etwas zu sehen ist. Je größer die App, desto länger dauert das. Mit **Code-Splitting** teilst du den Code auf: Selten gebrauchte Teile werden erst geladen, wenn man sie braucht.

## lazy und Suspense

```tsx
import { lazy, Suspense, useState } from 'react';

const Editor = lazy(() => import('./Editor'));

function Post() {
  const [editing, setEditing] = useState(false);
  return (
    <>
      <button onClick={() => setEditing(true)}>Bearbeiten</button>
      {editing && (
        <Suspense fallback={<p>Editor wird geladen …</p>}>
          <Editor />
        </Suspense>
      )}
    </>
  );
}
```

- `import('./Editor')` ist ein **dynamischer Import**: Vite legt den Editor in eine eigene Datei, die erst bei Bedarf geladen wird.
- `lazy` macht daraus eine Komponente. Beim ersten Rendern **suspendiert** sie, bis der Code da ist.
- Die nächste `<Suspense>`-Grenze zeigt solange ihr Fallback.

Die Datei muss die Komponente als **Default-Export** bereitstellen. Wichtig: `lazy` gehört auf oberste Ebene eines Moduls, nie in eine Komponente – sonst würde bei jedem Rendern eine neue Komponente entstehen.

## Was lohnt sich?

- **Ganze Seiten** einer App: Wer nie auf „Einstellungen“ klickt, lädt sie auch nie. Router wie React Router bieten dafür eigene Mechanismen (`lazy` in der Routen-Definition).
- **Große Komponenten** mit schweren Abhängigkeiten: Editoren, Diagramme, Karten.
- **Selten gezeigte Teile**: Dialoge, Admin-Bereiche.

Kleine Komponenten aufzuteilen bringt nichts – jede Datei ist eine eigene Anfrage.

> [!TIP]
> Im Netzwerk-Tab der Browser-Entwicklertools siehst du, wann welche Datei geladen wird. `npm run build` zeigt außerdem, wie groß die einzelnen Dateien sind.

::tryit{code-splitting}
