---
title: useFormStatus
minutes: 6
quiz:
  - question: "Woher importierst du `useFormStatus`?"
    options: ["`react`","`react-hook-form`","`react-router`","`react-dom`"]
    answer: 3
  - question: "Von welchem Formular liest `useFormStatus` den Status?"
    options: ["Von dem `<form>`, in dem die Komponente gerendert wird","Von jedem Formular der Seite","Von dem Formular, das als Prop übergeben wird","Von dem zuletzt abgeschickten Formular"]
    answer: 0
    explanation: "Deshalb muss die Komponente innerhalb des Formulars stehen. In derselben Komponente, die das `<form>` rendert, funktioniert es nicht."
exercise:
  example: ex-form-status
  title: Ein Speichern-Button
  task: |-
    Schreibe `SubmitButton` so, dass er den Status des umgebenden Formulars mit `useFormStatus()` (aus `react-dom`) liest:

    - Während gespeichert wird, ist er deaktiviert und zeigt **Saving …** mit dem Titel aus den gesendeten Daten, z. B. **Saving Holiday …** (`data.get('title')`).
    - Sonst zeigt er seine `children`.
  checks:
    pending-state: Während des Speicherns steht **Saving Holiday …** auf dem deaktivierten Button
    back-to-normal: Danach steht wieder **Save** darauf
    uses-form-status: "`SubmitButton` verwendet `useFormStatus()`"
---

# useFormStatus

Ein Absende-Button sitzt oft tief in einer Komponente, die gar nicht weiß, welche Action gerade läuft. **`useFormStatus`** liefert ihm den Status des Formulars, in dem er steht – ganz ohne Props.

## Ein wiederverwendbarer Button

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Wird gespeichert …' : children}
    </button>
  );
}

<form action={savePost}>
  <input name="title" />
  <SubmitButton>Veröffentlichen</SubmitButton>
</form>
```

Den Button kannst du in jedes Formular stecken – er zeigt immer den Status genau dieses Formulars.

## Was useFormStatus liefert

| Eigenschaft | Bedeutung |
|---|---|
| `pending` | `true`, solange die Action des Formulars läuft |
| `data` | die gesendeten `FormData` (oder `null`) |
| `method` | `'get'` oder `'post'` |
| `action` | die Action-Funktion |

Mit `data` kannst du anzeigen, *was* gerade gespeichert wird: `Speichere „${data.get('title')}“ …`.

> [!WARNING]
> `useFormStatus` funktioniert nur in einer Komponente, die **innerhalb** des `<form>` gerendert wird. In der Komponente, die das Formular selbst rendert, liefert es immer `pending: false`. Dort nimmst du stattdessen `isPending` aus `useActionState`.

## useFormStatus oder isPending?

- **`isPending` aus `useActionState`**: in der Komponente, die das Formular besitzt.
- **`useFormStatus`**: in wiederverwendbaren Bausteinen *innerhalb* des Formulars – Buttons, Ladeanzeigen, Felder, die sich während des Sendens sperren.

::tryit{form-status}
