---
title: Fokus steuern
minutes: 9
summary: |-
  - Alles muss per Tastatur bedienbar sein. Die Tab-Reihenfolge folgt dem DOM. `tabIndex={0}` nimmt ein Element in die Reihenfolge auf, `tabIndex={-1}` macht es nur per `focus()` fokussierbar. Positive Werte vermeiden.
  - Der Fokus muss sichtbar sein: Styles für `:focus-visible`, nie `outline: none` ohne Ersatz.
  - Mit einem Ref und `ref.current?.focus()` setzt du den Fokus nach Aktionen dorthin, wo es weitergeht – vor allem, wenn das fokussierte Element verschwindet.
  - Client-Router wie React Router setzen den Fokus nach einem Seitenwechsel nicht selbst. Üblich: die `<h1>` mit `tabIndex={-1}` fokussieren.
  - `<dialog>` mit `showModal()` erledigt das Schwierige: oberste Ebene, Rest der Seite inert, Escape schließt, Fokus wandert hinein und beim Schließen zurück. In React per Ref und Effekt öffnen, `onClose` hält den State synchron.
  - `inert` (in React 19 ein boolesches Attribut) sperrt einen Bereich für Maus, Tastatur und Screenreader.

  ```tsx
  useEffect(() => {
    const dialog = ref.current!;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  <dialog ref={ref} onClose={onClose}>…</dialog>
  ```
quiz:
  - question: "Was macht `dialog.showModal()` – im Gegensatz zur Prop `open`?"
    options: ["Nichts anderes, beides öffnet einen modalen Dialog", "Es öffnet den Dialog modal: oberste Ebene, Rest der Seite inert, Escape schließt, der Fokus wandert hinein", "Es rendert den Dialog per Portal in `document.body`", "Es verhindert, dass der Dialog geschlossen werden kann"]
    answer: 1
    explanation: "`open` zeigt den Dialog nur nicht-modal an. Die modalen Eigenschaften gibt es nur mit `showModal()`."
  - question: "Was bedeutet `tabIndex={-1}`?"
    options: ["Das Element kommt als Erstes in der Tab-Reihenfolge","Das Element ist gar nicht mehr fokussierbar","Das Element ist per `focus()` fokussierbar, aber nicht per Tab erreichbar","Das Element wird vor Screenreadern versteckt"]
    answer: 2
  - question: "Nach einem Klick auf „Löschen“ verschwindet der Button samt Listeneintrag. Wohin mit dem Fokus?"
    options: ["In die Adresszeile","Nirgends, der Browser regelt das","Auf das `<body>`-Element","Per Ref an eine sinnvolle Stelle, z. B. die Überschrift der Liste oder den nächsten Eintrag"]
    answer: 3
    explanation: "Verschwindet das fokussierte Element, landet der Fokus auf `<body>` – Tastatur-Nutzer müssen dann von vorn beginnen."
---

# Fokus steuern

Wer per Tastatur oder Screenreader unterwegs ist, ist immer an einer Stelle: dem **Fokus**. Bei klassischen Webseiten setzt der Browser ihn bei jedem Seitenwechsel zurück. In einer React-App ändert sich die Seite, ohne dass der Browser es merkt – um den Fokus musst du dich deshalb teilweise selbst kümmern.

## Tastatur

Alles, was mit der Maus geht, muss auch mit der Tastatur gehen. Native Elemente (Lektion 1) machen das meiste von selbst. Dazu:

- Die **Tab-Reihenfolge** folgt der Reihenfolge im DOM. Ordne das DOM so, wie man die Seite liest – nicht per CSS umsortieren.
- `tabIndex={0}` nimmt ein Element in die Tab-Reihenfolge auf. `tabIndex={-1}` macht es nur per `focus()` fokussierbar. Positive Werte bringen die Reihenfolge durcheinander – vermeiden.
- Der Fokus muss **sichtbar** sein. Entfernst du den Standard-Rahmen, ersetze ihn:

```css
button:focus-visible {
  outline: 3px solid #087ea4;
  outline-offset: 2px;
}
```

`:focus-visible` greift bei Tastatur-Fokus, aber meist nicht beim Mausklick – so stört der Rahmen niemanden.

Eigene Tastenkürzel hängst du mit `onKeyDown` an:

```tsx
<div role="search" onKeyDown={(e) => e.key === 'Escape' && setQuery('')}>
  <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Suche" />
</div>
```

## Fokus mit Refs setzen

Mit einem Ref und `focus()` schickst du den Fokus dorthin, wo es weitergeht. Typische Fälle:

- Ein Feld zum Bearbeiten erscheint → Fokus hinein.
- Ein Eintrag wird gelöscht, samt seinem Button → Fokus auf die Liste oder den nächsten Eintrag. Sonst landet er auf `<body>` und Tastatur-Nutzer beginnen von vorn.
- Ein Formular hat Fehler → Fokus auf das erste fehlerhafte Feld.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
const [editing, setEditing] = useState(false);

// Das Feld gibt es erst nach dem Rendern – deshalb im Effekt fokussieren
useEffect(() => {
  if (editing) inputRef.current?.focus();
}, [editing]);
```

Setz den Fokus nur als Folge einer Aktion. Springt er von allein herum, verlieren Nutzer die Orientierung.

## Fokus nach einem Seitenwechsel

Navigiert ein Client-Router wie React Router, bleibt der Fokus auf dem angeklickten Link – oder landet auf `<body>`, wenn der Link verschwindet. Ein Screenreader sagt vom Wechsel nichts an. React Router setzt den Fokus bewusst nicht selbst; das ist deine Aufgabe. Ein verbreitetes Muster: die `<h1>` der neuen Seite fokussieren.

```tsx
function Page({ title, children }: { title: string; children: ReactNode }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [title]);

  return (
    <main>
      <title>{title}</title>
      <h1 ref={headingRef} tabIndex={-1}>{title}</h1>
      {children}
    </main>
  );
}
```

`tabIndex={-1}` macht die Überschrift fokussierbar, ohne sie in die Tab-Reihenfolge aufzunehmen. Das `<title>`-Element hebt React 19 automatisch in den `<head>` – so stimmt auch der Seitentitel. Beim allerersten Laden soll der Fokus meist bleiben, wo der Browser ihn hinsetzt. In einer echten App überspringst du den ersten Aufruf deshalb.

## Dialoge mit `<dialog>`

Ein modaler Dialog braucht viel: oberste Ebene, Rest der Seite gesperrt, Escape schließt, Fokus hinein und danach zurück. Die Lektion zu Portalen in Kapitel 12 hat gezeigt, wie viel davon man von Hand bauen müsste. Das HTML-Element `<dialog>` kann das alles selbst – wenn du es mit `showModal()` öffnest:

| Eigenschaft | `showModal()` | Prop `open` |
|---|---|---|
| oberste Ebene, `::backdrop` | ja | nein |
| Rest der Seite inert | ja | nein |
| Escape schließt | ja | nein |
| Fokus wandert hinein | ja | nein |

Die Prop `open` öffnet den Dialog nur **nicht-modal**. In React rufst du `showModal()` deshalb über einen Ref in einem Effekt auf:

```tsx
function ConfirmDialog({ open, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current!;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} onClose={onClose}>
      {children}
      <form method="dialog">
        <button>Schließen</button>
      </form>
    </dialog>
  );
}
```

- `onClose` feuert bei **jedem** Schließen – auch per Escape. So bleibt dein State synchron.
- Ein Button in `<form method="dialog">` schließt den Dialog ohne eigenen Handler. Sein `value` landet in `dialog.returnValue`.
- Den Fokus setzt `showModal()` auf das erste fokussierbare Element. Soll ein anderes ihn bekommen, ruf dessen `focus()` direkt nach `showModal()` auf.
- Beim Schließen geben Browser den Fokus an das Element zurück, das ihn vorher hatte – meist den Button, der den Dialog geöffnet hat. Gibt es den nicht mehr, setz ihn selbst.
- Einen Titel bekommt der Dialog über `aria-labelledby`, verbunden per `useId`.

Probier es nur mit der Tastatur aus: Tab zu einem **Delete**-Button, Enter, dann Escape oder **Delete**. Nach dem Löschen landet der Fokus auf der Überschrift.

::tryit{dialog-focus}

## inert

Für eigene Overlays – etwa ein Seitenmenü – gibt es das Attribut `inert`. Alles darin ist nicht mehr klickbar, nicht fokussierbar und für Screenreader unsichtbar:

```tsx
<>
  <SideMenu open={menuOpen} />
  <main inert={menuOpen}>…</main>
</>
```

Seit React 19 ist `inert` ein normales boolesches Attribut. In React 18 kannte React es noch nicht – dort brauchte es Umwege wie `inert=""`.
