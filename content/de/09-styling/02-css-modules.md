---
title: CSS Modules
minutes: 6
quiz:
  - question: "Woran erkennt Vite eine CSS-Module-Datei?"
    options: ["Am Ordner `modules/`","An einem Kommentar am Dateianfang","An der Endung `.module.css`","An `@module` in der Datei"]
    answer: 2
  - question: "Was steht nach `import styles from './Card.module.css'` in `styles.card`?"
    options: ["Der CSS-Code der Klasse","Ein Style-Objekt für `style={…}`","`true`","Ein eindeutiger Klassenname wie `_card_1a2b3_1`"]
    answer: 3
exercise:
  example: ex-css-modules
  title: Konflikte auflösen
  task: |-
    Die globalen Klassen `.card` und `.title` kollidieren mit `legacy.css` – die Karte ist rosa und gestrichelt.

    1. Benenne `Card.css` in `Card.module.css` um.
    2. Importiere sie mit `import styles from './Card.module.css'`.
    3. Verwende `className={styles.card}` und `className={styles.title}`.
  checks:
    scoped-class: Die Karte hat eine eindeutige Modul-Klasse statt `card`
    own-styles: Die eigenen Stile (Rundung, Titelfarbe) greifen
    no-clash: Die Stile aus `legacy.css` greifen nicht mehr
---

# CSS Modules

**CSS Modules** lösen das größte Problem von globalem CSS: Namenskonflikte. Jede Klasse gilt nur für die Datei, die sie importiert.

## So funktioniert es

Eine Datei, deren Name auf **`.module.css`** endet, behandelt Vite als CSS Module:

```css
/* Card.module.css */
.card {
  border-radius: 12px;
  padding: 1rem;
}

.title {
  color: #087ea4;
}
```

Beim Import bekommst du ein Objekt mit den Klassennamen:

```tsx
import styles from './Card.module.css';

export default function Card({ title, children }: CardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
```

Vite macht aus `.card` einen eindeutigen Namen wie `_card_1a2b3_1`. Eine andere Datei kann ebenfalls `.title` definieren – die beiden kommen sich nie in die Quere.

## Mehrere Klassen und Varianten

```tsx
<button className={`${styles.button} ${styles[variant]}`}>…</button>
```

Mit `styles[variant]` wählst du eine Klasse passend zu einer Prop. Für viele Bedingungen hilft auch hier `clsx`.

## Globale Ausnahmen

Brauchst du in einem Modul doch einen globalen Selektor, etwa für eine Klasse aus einer fremden Bibliothek, markierst du ihn mit `:global`:

```css
.card :global(.highlight) {
  background: yellow;
}
```

> [!TIP]
> Mit TypeScript kennt `styles` alle Klassennamen nur als `string` – Tippfehler wie `styles.crad` fallen erst im Browser auf. Halte Modul-Dateien deshalb klein und neben ihrer Komponente.

::tryit{css-modules}
