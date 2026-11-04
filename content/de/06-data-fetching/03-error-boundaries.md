---
title: Error Boundaries
minutes: 7
quiz:
  - question: "Welche Fehler fängt eine Error Boundary?"
    options: ["Alle Fehler der Seite", "Fehler beim Rendern ihrer Kinder (auch aus `use()`)", "Fehler in Event-Handlern", "Fehler in `setTimeout`"]
    answer: 1
    explanation: "Fehler in Event-Handlern und asynchronem Code fängst du mit `try/catch` und zeigst sie über State an."
  - question: "Wie wird eine Error Boundary geschrieben?"
    options: ["Als Funktionskomponente mit `useError`", "Als Klassenkomponente mit `static getDerivedStateFromError`", "Mit `try/catch` um das JSX", "Mit `<Suspense>`"]
    answer: 1
exercise:
  example: ex-error-boundary
  title: Einen Absturz abfangen
  task: |-
    Der Zähler stürzt ab, sobald er 3 erreicht – und nimmt die ganze App mit.

    1. Ergänze in `ErrorBoundary` die Methode `static getDerivedStateFromError(error)`, die `{ error }` zurückgibt.
    2. Gibt es einen Fehler, zeige `<div role="alert">` mit **Something went wrong:** und der Meldung sowie einen Button **Try again**.
    3. **Try again** setzt den Fehler zurück, sodass die Kinder wieder angezeigt werden.
  checks:
    shows-fallback: Nach dem Absturz erscheint die Fehlermeldung
    rest-survives: Der Rest der Seite bleibt sichtbar
    try-again: "**Try again** zeigt den Zähler wieder an"
---

# Error Boundaries

Wirft eine Komponente beim Rendern einen Fehler, entfernt React normalerweise die **gesamte** App vom Bildschirm. Eine **Error Boundary** fängt den Fehler ab und zeigt stattdessen eine Ersatzanzeige – nur für ihren Teil der Seite.

## Eine Error Boundary schreiben

Error Boundaries sind der eine Fall, in dem du noch eine **Klassenkomponente** brauchst:

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error }; // nächstes Rendern zeigt die Ersatzanzeige
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logToService(error, info.componentStack); // z. B. an ein Monitoring melden
  }

  render() {
    if (this.state.error) return <p role="alert">Etwas ist schiefgelaufen.</p>;
    return this.props.children;
  }
}
```

- `getDerivedStateFromError` setzt nach einem Fehler den State.
- `componentDidCatch` ist der Ort zum Protokollieren.
- Setzt du `error` wieder auf `null`, rendert die Boundary ihre Kinder erneut – praktisch für einen „Nochmal versuchen“-Button.

## Verwenden

```tsx
<ErrorBoundary>
  <Suspense fallback={<Spinner />}>
    <Comments />
  </Suspense>
</ErrorBoundary>
```

Platziere Boundaries dort, wo ein Ausfall eingegrenzt werden soll: um ein Widget, eine Seite, einen Bereich. Zusammen mit Suspense deckst du so beide Fälle ab: **lädt noch** und **fehlgeschlagen**.

## Was Error Boundaries nicht fangen

- Fehler in **Event-Handlern** – hier hilft `try/catch` plus State.
- **Asynchronen** Code wie `setTimeout` oder ein `fetch`, dessen Fehler du nicht an React weitergibst.
- Fehler in der Boundary selbst.

> [!TIP]
> Statt die Klasse selbst zu schreiben, nutzen viele Projekte das Paket **react-error-boundary**. Es bietet `<ErrorBoundary FallbackComponent={…}>`, eine Reset-Funktion und den Hook `useErrorBoundary`, mit dem du auch Fehler aus Event-Handlern an die Boundary geben kannst.

::tryit{error-boundary}
