---
title: Was ist React?
minutes: 6
quiz:
  - question: "Was ist React?"
    options: ["Ein komplettes Framework mit Router, HTTP-Client und Formularen", "Eine JavaScript-Bibliothek zum Bauen von Benutzeroberflächen", "Eine Programmiersprache, die zu JavaScript kompiliert", "Ein CSS-Framework"]
    answer: 1
    explanation: "React kümmert sich um die Oberfläche. Routing, Datenladen & Co. kommen aus weiteren Bibliotheken oder einem Framework wie Next.js."
  - question: "Was beschreibst du in React, wenn du eine Komponente schreibst?"
    options: ["Die einzelnen DOM-Befehle, die bei einem Klick ausgeführt werden", "Wie die Oberfläche für den aktuellen Zustand aussehen soll", "Die CSS-Animationen der Seite", "Die Datenbanktabellen der App"]
    answer: 1
    explanation: "React ist deklarativ: Du beschreibst das Ergebnis, React bringt das DOM selbst auf den passenden Stand."
---

# Was ist React?

**React** ist eine JavaScript-Bibliothek zum Bauen von Benutzeroberflächen. Sie wurde bei Meta (Facebook) entwickelt, ist Open Source und eine der meistgenutzten Techniken für moderne Web-Apps.

## Die Grundidee: Komponenten

Eine React-App besteht aus **Komponenten** – kleinen, wiederverwendbaren Bausteinen. Eine Komponente ist einfach eine JavaScript-Funktion, die beschreibt, was auf dem Bildschirm erscheinen soll:

```tsx
function Welcome() {
  return <h1>Hallo, React!</h1>;
}
```

Das `<h1>` mitten im JavaScript heißt **JSX** – dazu gleich mehr in Kapitel 2. Komponenten lassen sich wie HTML-Tags verschachteln: Eine `App` enthält einen `Header`, eine `ProductList` und einen `Footer`, die `ProductList` enthält viele `ProductCard`s.

## Deklarativ statt imperativ

Ohne React schreibst du Schritt für Schritt auf, *wie* sich die Seite ändern soll: Element suchen, Text setzen, Klasse hinzufügen, Element entfernen … Mit React beschreibst du nur, *was* für den aktuellen Zustand angezeigt werden soll:

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count} Klicks</button>;
}
```

Ändert sich `count`, ruft React die Funktion erneut auf und aktualisiert im DOM genau die Stellen, die sich geändert haben. Du musst dich nicht um das „Wie“ kümmern.

## React ist eine Bibliothek

React kümmert sich nur um die Oberfläche. Für Routing, Datenladen oder Formulare greifst du zu weiteren Bibliotheken (z. B. React Router, TanStack Query) – oder zu einem **Framework** wie Next.js oder React Router (Framework-Modus), das diese Teile mitbringt.

| Thema | Wer kümmert sich darum? |
|---|---|
| Komponenten, State, Rendering | React |
| Projekt-Setup, Dev-Server, Build | Vite (oder ein Framework) |
| Seiten und URLs | z. B. React Router |
| Daten vom Server | `fetch`, TanStack Query, Framework-Loader |

In diesem Kurs arbeitest du mit **React 19**, **TypeScript** und **Vite** – so wie in den meisten neuen Projekten.

::tryit{hello-react}

> [!TIP]
> Ändere im Beispiel die Überschrift und speichere. Die Vorschau aktualisiert sich sofort – ohne dass der Zähler zurückgesetzt wird. Das ist *Fast Refresh*.
