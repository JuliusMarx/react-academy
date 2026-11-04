---
title: Props
minutes: 8
quiz:
  - question: "Darf eine Komponente ihre Props ändern?"
    options: ["Ja, jederzeit", "Nein, Props sind schreibgeschützt", "Nur Zahlen und Strings", "Nur mit `setProps`"]
    answer: 1
    explanation: "Props gehören der Elternkomponente. Was sich ändern soll, ist State – mehr dazu in Kapitel 3."
  - question: "Wie gibst du eine Zahl als Prop weiter?"
    options: ["`price=\"3.5\"`", "`price={3.5}`", "`price=(3.5)`", "`:price=\"3.5\"`"]
    answer: 1
    explanation: "In Anführungszeichen ist es immer ein String. Alles andere übergibst du in geschweiften Klammern."
  - question: "Wie heißt die Prop, die den Inhalt zwischen öffnendem und schließendem Tag enthält?"
    options: ["`content`", "`slot`", "`children`", "`inner`"]
    answer: 2
exercise:
  example: ex-props
  title: Ein Team-Badge
  task: |-
    1. `UserBadge` soll seine Props verwenden: den Namen in `<strong>`, die Rolle in `<span className="role">`.
    2. Wird keine Rolle übergeben, zeigt der Badge **Member**.
    3. Zeige in `App` drei Badges: **Ada** (Admin), **Linus** (ohne Rolle) und **Grace** (Editor).
  checks:
    shows-name: Der Badge zeigt den übergebenen Namen
    shows-role: Der Badge zeigt die übergebene Rolle
    default-role: Ohne Rolle steht dort **Member**
    three-badges: Die App zeigt Ada Admin, Linus Member, Grace Editor
---

# Props

Mit **Props** (kurz für *properties*) gibt eine Elternkomponente Daten an ihre Kinder weiter – so wie Attribute bei HTML-Elementen.

## Props übergeben und lesen

```tsx
<ProductCard name="Kaffee" price={3.5} onSale />
```

- Strings stehen in Anführungszeichen, alles andere in `{ }`.
- Ein Attribut ohne Wert (`onSale`) ist `true`.

Die Komponente bekommt alle Props als **ein Objekt**. Meist zerlegst du es direkt in der Parameterliste:

```tsx
type ProductCardProps = {
  name: string;
  price: number;
  onSale?: boolean;
};

function ProductCard({ name, price, onSale = false }: ProductCardProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{price.toFixed(2)} € {onSale && <strong>Angebot!</strong>}</p>
    </article>
  );
}
```

Mit TypeScript beschreibst du die Props als Typ. Optionale Props bekommen ein `?` und mit `= false` einen **Standardwert**.

## Props sind schreibgeschützt

Eine Komponente darf ihre Props nie verändern. Sie verhält sich wie eine reine Funktion: gleiche Props, gleiches Ergebnis. Soll sich etwas ändern, übergibt die Elternkomponente neue Props – oder die Komponente verwaltet eigenen **State** (Kapitel 3).

## children

Was zwischen öffnendem und schließendem Tag steht, kommt als Prop **`children`** an. So baust du Rahmen-Komponenten wie Karten, Panels oder Layouts:

```tsx
import type { ReactNode } from 'react';

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  );
}

<Panel title="Shop">
  <ProductCard name="Kaffee" price={3.5} />
</Panel>
```

## Props weiterreichen

Mit dem Spread-Operator reichst du alle Props auf einmal weiter: `<Avatar {...props} />`. Das ist praktisch, aber sparsam einsetzen – explizite Props sind leichter zu lesen.

::tryit{props}
