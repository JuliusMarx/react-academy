---
title: Bedingtes Rendern
minutes: 6
summary: |-
  - In JSX gibt es kein `if` – du nutzt normales JavaScript.
  - Außerhalb des JSX funktioniert `if` mit frühem `return`. Soll eine Komponente nichts anzeigen, gibt sie `null` zurück.
  - Entweder – oder: der ternäre Operator `{loggedIn ? <LogoutButton /> : <LoginForm />}`.
  - Nur wenn: `{bedingung && <p>…</p>}`. Ist die linke Seite falsy, zeigt React nichts an.
  - Bei vielen Fällen berechnest du den Inhalt vorher in einer Variable und setzt sie dann ins JSX ein.

  ```tsx
  function StatusMessage({ status }: { status: 'loading' | 'error' | 'done' }) {
    if (status === 'loading') return <p>Lädt …</p>;
    if (status === 'error') return <p>Fehler!</p>;
    return <p>Fertig.</p>;
  }
  ```

  > [!WARNING] `{messages.length && <p>…</p>}` zeigt bei leerer Liste eine **0** an – vergleiche ausdrücklich: `messages.length > 0 &&`.
quiz:
  - question: "Was zeigt `{count && <p>Neu</p>}`, wenn `count` 0 ist?"
    options: ["Nichts","`false`","Eine 0","Einen Fehler"]
    answer: 2
    explanation: "`0 && …` ergibt `0`, und React rendert Zahlen. Schreib besser `count > 0 && …`."
  - question: "Wie sorgt eine Komponente dafür, dass sie gar nichts anzeigt?"
    options: ["`return 0`","`hide()` aufrufen","`this.visible = false` setzen","`return null`"]
    answer: 3
    explanation: "`null` rendert nichts (ebenso `false` oder `undefined`). Eine `0` würde React dagegen als Zahl anzeigen."
---

# Bedingtes Rendern

In JSX gibt es kein `if` – du nutzt normales JavaScript. Drei Muster decken fast alles ab.

## if mit frühem return

Außerhalb des JSX kannst du ganz normal `if` verwenden:

```tsx
function StatusMessage({ status }: { status: 'loading' | 'error' | 'done' }) {
  if (status === 'loading') return <p>Lädt …</p>;
  if (status === 'error') return <p>Fehler!</p>;
  return <p>Fertig.</p>;
}
```

Soll eine Komponente gar nichts anzeigen, gibt sie `null` zurück.

## Ternärer Operator: entweder – oder

```tsx
<h1>{loggedIn ? 'Willkommen zurück!' : 'Bitte anmelden'}</h1>

{loggedIn ? <LogoutButton /> : <LoginForm />}
```

## && – nur wenn

```tsx
{messages.length > 0 && <p>Du hast {messages.length} neue Nachrichten.</p>}
```

Ist die linke Seite falsy, zeigt React nichts an.

> [!WARNING]
> Vorsicht mit Zahlen links von `&&`: Bei `{messages.length && <p>…</p>}` und einer leeren Liste steht eine **0** auf der Seite. Vergleiche lieber ausdrücklich: `messages.length > 0 &&`.

## In Variablen vorbereiten

Wird es unübersichtlich, berechne den Inhalt vorher in einer Variable:

```tsx
let content;
if (isAdmin) content = <AdminPanel />;
else if (isLoggedIn) content = <Dashboard />;
else content = <LoginForm />;

return <main>{content}</main>;
```

::tryit{conditional-rendering}
