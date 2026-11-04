---
title: useActionState
minutes: 9
quiz:
  - question: "Was gibt `useActionState(action, initialState)` zurück?"
    options: ["Nur den State","`[formData, setFormData]`","Ein Promise","`[state, formAction, isPending]`"]
    answer: 3
  - question: "Welche Argumente bekommt eine Action für `useActionState`?"
    options: ["Den vorherigen State und die `FormData`","Nur `formData`","Das Event und den State","Keine"]
    answer: 0
  - question: "Die Action gibt einen Validierungsfehler zurück. Was passiert mit den unkontrollierten Feldern?"
    options: ["Sie behalten ihren Wert automatisch", "Auch dann setzt React das Formular zurück – gib die Werte im State zurück und setze sie als `defaultValue`", "Sie werden rot markiert", "Die Seite lädt neu"]
    answer: 1
exercise:
  example: ex-action-state
  title: Kommentare mit Validierung
  task: |-
    1. Schreibe `addComment` als Action für `useActionState`: `(previousState, formData) => nächster State`.
       - Ist der Kommentar kürzer als 3 Zeichen, bleiben die Kommentare gleich und `error` wird **Comment is too short**.
       - Sonst wartest du auf `postComment(text)`, hängst ihn an und setzt `error` auf `null`.
    2. Rufe `useActionState(addComment, initialState)` auf und verwende State, Action und `isPending`: `<form action={…}>`, den Fehler in `<p id="error">`, und während des Sendens ist der Button deaktiviert und zeigt **Posting …**.
  checks:
    validates: Ein zu kurzer Kommentar zeigt **Comment is too short**
    pending: Während des Sendens ist der Button deaktiviert und zeigt **Posting …**
    adds-comment: Ein gültiger Kommentar erscheint in der Liste
    uses-action-state: "Verwendet wird `useActionState`"
---

# useActionState

Eine Action allein liefert nichts zurück. Meist willst du aber ein **Ergebnis** anzeigen – eine Fehlermeldung, eine Bestätigung – und wissen, ob die Action **gerade läuft**. Genau das macht **`useActionState`**.

## Grundform

```tsx
import { useActionState } from 'react';

type State = { error: string | null };

async function subscribe(previousState: State, formData: FormData): Promise<State> {
  const email = String(formData.get('email'));
  if (!email.includes('@')) return { error: 'Bitte eine gültige E-Mail eingeben.' };
  await api.subscribe(email);
  return { error: null };
}

function Newsletter() {
  const [state, formAction, isPending] = useActionState(subscribe, { error: null });

  return (
    <form action={formAction}>
      <input name="email" />
      {state.error && <p role="alert">{state.error}</p>}
      <button disabled={isPending}>{isPending ? 'Sende …' : 'Abonnieren'}</button>
    </form>
  );
}
```

- Die Action bekommt den **vorherigen State** und die **`FormData`**. Was sie zurückgibt, wird der neue State.
- Du übergibst dem Formular nicht deine Funktion, sondern die zurückgegebene **`formAction`**.
- **`isPending`** ist `true`, solange die Action läuft.

## Fehler zurückgeben statt werfen

Erwartbare Probleme wie ungültige Eingaben gibst du als State zurück. So kann das Formular sie direkt anzeigen. Ein geworfener Fehler landet dagegen bei der nächsten Error Boundary – das ist für Unerwartetes gedacht.

## Eingaben nach einem Fehler behalten

React setzt das Formular nach **jeder** abgeschlossenen Action zurück – auch wenn sie einen Fehler meldet. Damit Nutzer nicht alles neu tippen müssen, gibst du die Werte im State mit zurück und setzt sie als `defaultValue`:

```tsx
async function signUp(prev: State, formData: FormData): Promise<State> {
  const name = String(formData.get('name'));
  if (name.length < 2) return { error: 'Name zu kurz', name };
  // …
}

<input name="name" defaultValue={state.name} />
```

Passwörter gibst du bewusst nicht zurück – die werden geleert.

## Validierung

Für kleine Formulare reicht eine Prüfung in der Action. Bei vielen Feldern lohnt sich ein Schema mit einer Bibliothek wie **Zod**, das du in der Action ausführst. Für sehr umfangreiche Formulare mit Prüfung während der Eingabe gibt es **React Hook Form**.

> [!TIP]
> Prüfe zusätzlich schon im Browser mit HTML-Attributen wie `required`, `minLength` oder `type="email"`. Das ist kostenlos und barrierefrei – ersetzt aber nie die Prüfung in der Action bzw. auf dem Server.

::tryit{action-state}
