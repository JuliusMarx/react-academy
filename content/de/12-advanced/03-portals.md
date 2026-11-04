---
title: Portale
minutes: 6
quiz:
  - question: "Wohin rendert `createPortal(<Dialog />, document.body)` den Dialog?"
    options: ["In die Elternkomponente", "Direkt in `document.body` – außerhalb des DOM-Baums der Elternkomponente", "In ein neues Fenster", "Nirgends, man braucht noch `render()`"]
    answer: 1
  - question: "Ein Klick im Portal – bei wem kommt das React-Event an?"
    options: ["Nur bei `document.body`","Bei niemandem","Bei den React-Eltern, wie bei jedem anderen Kind – Events folgen dem React-Baum, nicht dem DOM","Nur im Portal selbst"]
    answer: 2
exercise:
  example: ex-portal
  title: Ein Dialog per Portal
  task: |-
    Der Dialog wird innerhalb von `<main>` gerendert – dort schneidet ihn `overflow: hidden` ab.

    1. Rendere ihn mit `createPortal` (aus `react-dom`) in `document.body`.
    2. **Escape** ruft `onClose` auf – über einen `keydown`-Listener auf `window` in einem Effekt, mit Cleanup.
  checks:
    renders-in-body: Der Dialog landet in `document.body`, nicht in `#root`
    close-button: "**Close** schließt den Dialog"
    escape-closes: "**Escape** schließt den Dialog"
---

# Portale

Normalerweise landet alles, was eine Komponente rendert, im DOM innerhalb ihrer Elternkomponente. Für Dialoge, Tooltips und Benachrichtigungen ist das oft hinderlich: Ein `overflow: hidden` oder ein `z-index` weiter oben schneidet sie ab oder verdeckt sie. Mit einem **Portal** renderst du an eine ganz andere Stelle im DOM.

## createPortal

```tsx
import { createPortal } from 'react-dom';

function Modal({ children, onClose }: ModalProps) {
  return createPortal(
    <div className="backdrop">
      <div role="dialog" aria-modal="true">
        {children}
        <button onClick={onClose}>Schließen</button>
      </div>
    </div>,
    document.body,
  );
}
```

Das erste Argument ist das JSX, das zweite das DOM-Element, in das es kommt – meist `document.body` oder ein eigener Container wie `<div id="modal-root">`.

## Im DOM woanders, in React an Ort und Stelle

Ein Portal verlässt nur den **DOM**-Baum. Für React bleibt es ein ganz normales Kind seiner Elternkomponente:

- Es bekommt **Props** und **Context** wie jedes andere Kind.
- **Events** steigen im React-Baum auf: Ein Klick im Dialog löst auch `onClick` der Elternkomponente aus, obwohl der Dialog im DOM gar nicht darin liegt.

## Barrierefreie Dialoge

Ein Dialog braucht mehr als die richtige Position:

- `role="dialog"`, `aria-modal="true"` und einen Titel über `aria-labelledby`.
- Beim Öffnen den **Fokus** in den Dialog setzen, beim Schließen zurück zum auslösenden Button.
- **Escape** schließt den Dialog.
- Der Fokus soll den Dialog per Tab nicht verlassen (*Focus Trap*).

> [!TIP]
> Das HTML-Element `<dialog>` mit `showModal()` erledigt Fokus, Escape und die oberste Ebene schon selbst – ganz ohne Portal. Für komplexere Fälle helfen Headless-Bibliotheken wie Radix UI (Kapitel 9).

::tryit{portals}
