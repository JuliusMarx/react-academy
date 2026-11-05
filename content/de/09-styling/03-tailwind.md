---
title: Tailwind CSS
minutes: 8
summary: |-
  - Tailwind setzt kleine **Utility-Klassen** direkt im JSX zusammen, jede macht genau eine Sache (`px-4`, `rounded-lg`). Ungenutzte Stile verschwinden aus dem Build.
  - Einrichten: `tailwindcss` und `@tailwindcss/vite` installieren, `tailwindcss()` als Vite-Plugin eintragen, `@import 'tailwindcss';` ins CSS. Keine `tailwind.config.js` nötig.
  - Eigene Farben und Abstände legst du im CSS mit `@theme` fest.
  - Präfixe wie `hover:`, `focus-visible:`, `md:` oder `dark:` wenden eine Klasse nur unter einer Bedingung an. Ohne Präfix gilt sie immer (mobile first).
  - Wiederholt sich eine Kombination, machst du eine Komponente daraus (`<Button>`), statt eigene CSS-Klassen zu schreiben.

  ```tsx
  const colors = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  <div className="grid gap-4 md:grid-cols-2">
    <span className={`rounded-full px-3 py-1 ${colors[status]}`}>…</span>
  </div>
  ```

  > [!WARNING] Tailwind findet nur vollständige Klassennamen – zusammengesetzte wie `` `bg-${color}-100` `` fehlen im CSS.
quiz:
  - question: "Wie richtest du Tailwind CSS 4 in einem Vite-Projekt ein?"
    options: ["Mit einer `tailwind.config.js` und PostCSS","Mit einem `<script>` von einem CDN","Mit dem Plugin `@tailwindcss/vite` und `@import 'tailwindcss'` in der CSS-Datei","Gar nicht, es ist in React eingebaut"]
    answer: 2
  - question: "Was bedeutet `md:grid-cols-2`?"
    options: ["Immer zwei Spalten","Mittlere Spaltenbreite","Zwei Spalten nur auf Mobilgeräten","Zwei Spalten ab dem Breakpoint `md` (mittelgroße Bildschirme)"]
    answer: 3
  - question: "Warum darfst du Klassennamen nicht zusammensetzen, z. B. `bg-${color}-100`?"
    options: ["Tailwind erzeugt nur Klassen, die es vollständig im Quellcode findet","Das ist ein Syntaxfehler","Weil Template-Strings in JSX verboten sind","Das darfst du"]
    answer: 0
exercise:
  example: ex-tailwind
  title: Status-Badges
  task: |-
    Gestalte `Badge` mit Tailwind-Klassen:

    - immer: `inline-flex rounded-full px-3 py-1 text-sm font-medium`
    - bei `success`: `bg-green-100 text-green-800`
    - bei `error`: `bg-red-100 text-red-800`

    Schreibe die Farbklassen vollständig aus, z. B. in einem Objekt pro Status.
  checks:
    base-classes: Der Badge hat die gemeinsamen Klassen
    variants: Jeder Status bekommt seine Farben
    tailwind-applies: Tailwind erzeugt das CSS wirklich (12px Innenabstand)
---

# Tailwind CSS

**Tailwind CSS** verfolgt einen anderen Ansatz: Statt eigene Klassen zu schreiben, setzt du kleine **Utility-Klassen** direkt im JSX zusammen – jede macht genau eine Sache.

```tsx
<button className="rounded-lg bg-sky-700 px-4 py-2 font-medium text-white hover:bg-sky-800">
  Speichern
</button>
```

`px-4` ist horizontaler Innenabstand, `rounded-lg` eine Rundung, `hover:bg-sky-800` eine dunklere Farbe beim Überfahren. Du schreibst kein CSS mehr, musst keine Klassennamen erfinden, und Stile, die du nicht mehr verwendest, verschwinden automatisch aus dem Build.

## Einrichten

```bash
npm install tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* src/index.css */
@import 'tailwindcss';
```

Mehr braucht Tailwind 4 nicht – keine `tailwind.config.js`, kein PostCSS. Eigene Farben und Abstände legst du direkt im CSS mit `@theme` fest.

## Varianten: Zustände und Breakpoints

Ein Präfix wendet eine Klasse nur unter einer Bedingung an:

| Präfix | Gilt … |
|---|---|
| `hover:`, `focus-visible:`, `disabled:` | im jeweiligen Zustand |
| `md:`, `lg:` | ab einer Bildschirmbreite (mobile first) |
| `dark:` | im dunklen Farbschema |

```tsx
<div className="grid gap-4 md:grid-cols-2">…</div>
```

Ohne Präfix gilt eine Klasse immer – also zuerst für kleine Bildschirme. `md:grid-cols-2` ergänzt ab mittlerer Breite zwei Spalten.

## Klassen abhängig machen

> [!WARNING]
> Tailwind durchsucht deinen Quellcode nach **vollständigen** Klassennamen. Zusammengesetzte Namen wie `` `bg-${color}-100` `` findet es nicht – die Klasse fehlt dann im CSS. Schreibe jede Variante aus:

```tsx
const colors = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
};

<span className={`rounded-full px-3 py-1 ${colors[status]}`}>…</span>
```

## Wiederholungen vermeiden

Lange Klassenlisten wirken anfangs ungewohnt. Wiederholt sich eine Kombination, ist die Antwort in React meist: **eine Komponente daraus machen** (`<Button>`, `<Badge>`) – nicht eigene CSS-Klassen.

::tryit{tailwind}
