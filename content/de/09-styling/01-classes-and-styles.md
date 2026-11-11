---
title: Klassen und Inline-Styles
minutes: 7
summary: |-
  - Mit Vite importierst du CSS-Dateien direkt in eine Komponente: `import './App.css'`. Sie gelten für die ganze Seite.
  - `className` nimmt einen String, mehrere Klassen trennst du mit Leerzeichen. Bedingte Klassen baust du mit Template-Strings, Ternary oder dem Paket `clsx`.
  - `style` nimmt ein **Objekt** mit camelCase-Eigenschaften. Zahlen werden zu Pixeln (außer bei einheitenlosen Eigenschaften wie `opacity` oder `zIndex`).
  - Inline-Styles eignen sich für Werte, die zur Laufzeit entstehen. `:hover`, `:focus` und Media Queries gehen damit nicht.
  - Mittelweg: Das Styling steht im CSS, nur der Wert kommt als CSS-Variable aus React.

  ```tsx
  import clsx from 'clsx';
  import type { CSSProperties } from 'react';

  <button className={clsx('tab', { active: isActive, disabled: !enabled })}>…</button>

  <div style={{ width: `${progress}%`, marginTop: 8 }} />

  <p className="swatch" style={{ '--swatch': color } as CSSProperties}>…</p>
  ```

  > [!WARNING] Normale CSS-Dateien sind global: Zwei Klassen namens `.card` überschreiben sich gegenseitig.
quiz:
  - question: "Wie schreibst du in JSX die CSS-Eigenschaft `background-color` als Inline-Style?"
    options: ["`style=\"background-color: red\"`", "`style={{ backgroundColor: 'red' }}`", "`style={{ 'background-color': red }}`", "`css={{ background: red }}`"]
    answer: 1
  - question: "Wofür nimmst du Inline-Styles statt Klassen?"
    options: ["Für alles – sie sind schneller","Für Hover-Effekte","Für Werte, die sich zur Laufzeit berechnen, z. B. eine Breite in Prozent","Für Media Queries"]
    answer: 2
    explanation: "Pseudoklassen wie `:hover` und Media Queries gehen mit Inline-Styles gar nicht. Für alles Feste sind Klassen besser."
exercise:
  example: ex-class-names
  title: Tabs und Fortschrittsbalken
  task: |-
    1. Jeder Tab hat die Klasse `tab`, der aktive zusätzlich `active`.
    2. Ein Klick auf einen Tab macht ihn zum aktiven.
    3. `ProgressBar` setzt die Breite von `.bar` per Inline-Style auf `percent` Prozent – aber nie mehr als 100 % und nie weniger als 0 %.
  checks:
    tab-classes: Alle Tabs haben `tab`, anfangs ist nur **Profile** aktiv
    switches: Ein Klick auf **Settings** macht Settings aktiv
    bar-width: "`percent={40}` ergibt `width: 40%`"
    bar-clamped: Werte über 100 und unter 0 werden begrenzt
---

# Klassen und Inline-Styles

React schreibt dir nicht vor, wie du stylst. Die Grundlage ist ganz normales CSS – du verknüpfst es über `className` oder setzt Stile direkt mit `style`.

## CSS-Dateien und className

Mit Vite importierst du CSS-Dateien direkt in eine Komponente. Sie gelten dann für die ganze Seite:

```tsx
import './App.css';

function Alert({ children }: { children: string }) {
  return <p className="alert">{children}</p>;
}
```

`className` nimmt einen String. Mehrere Klassen trennst du mit Leerzeichen: `className="alert alert-danger"`.

## Klassen abhängig machen

Klassen setzt du oft abhängig von Props oder State:

```tsx
<p className={`alert alert-${variant}`}>…</p>

<button className={isActive ? 'tab active' : 'tab'}>…</button>
```

Bei mehreren Bedingungen wird das schnell unübersichtlich. Dafür gibt es das winzige Paket **clsx**:

```tsx
import clsx from 'clsx';

<button className={clsx('tab', { active: isActive, disabled: !enabled })}>…</button>
```

## Inline-Styles

Das Attribut `style` nimmt ein **Objekt**. Eigenschaften schreibst du in camelCase, Zahlen werden zu Pixeln (außer bei einheitenlosen Eigenschaften wie `opacity`, `zIndex` oder `lineHeight`):

```tsx
<div style={{ width: `${progress}%`, marginTop: 8, backgroundColor: color }} />
```

Inline-Styles eignen sich für **Werte, die zur Laufzeit entstehen**: Breiten, Positionen, eine Farbe aus den Daten. Für alles andere sind Klassen besser – `:hover`, `:focus` und Media Queries gehen mit Inline-Styles gar nicht.

## CSS-Variablen

Ein guter Mittelweg: Das Styling steht im CSS, nur der Wert kommt aus React.

```tsx
import type { CSSProperties } from 'react';

<p className="swatch" style={{ '--swatch': color } as CSSProperties}>…</p>
```

```css
.swatch {
  border-left: 8px solid var(--swatch);
}
```

> [!WARNING]
> Normale CSS-Dateien sind **global**. Heißt eine Klasse in zwei Dateien `.card`, überschreiben sie sich gegenseitig – egal, welche Komponente sie importiert. Die nächste Lektion zeigt, wie CSS Modules das verhindern.

::tryit{styling-basics}
