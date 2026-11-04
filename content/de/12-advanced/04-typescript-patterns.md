---
title: TypeScript-Muster
minutes: 9
quiz:
  - question: "Wie gibst du einer eigenen Button-Komponente alle Props eines normalen `<button>`?"
    options: ["Mit `ComponentProps<'button'>`","Mit `any`","Indem du jede Prop einzeln aufschreibst","Gar nicht"]
    answer: 0
  - question: "Welcher Typ passt für `children`, wenn beliebiges JSX erlaubt sein soll?"
    options: ["`JSX.Element`", "`ReactNode`", "`string`", "`HTMLElement`"]
    answer: 1
    explanation: "`ReactNode` umfasst JSX, Strings, Zahlen, `null` und Arrays davon – alles, was React rendern kann."
  - question: "Was ist der Vorteil einer Discriminated Union wie `{ status: 'error'; message: string } | { status: 'done'; count: number }`?"
    options: ["Sie ist kürzer","Sie macht Props optional","TypeScript weiß nach einer Prüfung auf `status`, welche weiteren Props es gibt","Es gibt keinen"]
    answer: 2
exercise:
  example: ex-typescript
  title: Ein vielseitiger Button
  task: |-
    1. `Button` akzeptiert alle Props eines nativen `<button>` plus `variant`: `ComponentProps<'button'> & { variant?: 'primary' | 'danger' }`.
    2. Alle anderen Props reicht er an den `<button>` weiter (`type`, `disabled`, `onClick`, `aria-label` …).
    3. Die Klasse ist `btn btn-primary` oder `btn btn-danger` (Standard: primary).

    Entferne danach die Zeile mit `@ts-expect-error` in `App.tsx`.
  checks:
    variant-class: Die Klasse passt zur Variante
    passes-props: "`type`, `disabled`, `aria-label` und `title` kommen am `<button>` an"
    onclick-works: "**Delete** löscht das Konto und deaktiviert den Button"
---

# TypeScript-Muster

TypeScript und React passen hervorragend zusammen: Props werden geprüft, Editoren schlagen passende Werte vor, und viele Fehler fallen auf, bevor der Code läuft. Ein paar Muster begegnen dir immer wieder.

## Props typisieren

```tsx
type CardProps = {
  title: string;
  subtitle?: string; // optional
  children: ReactNode; // beliebiger Inhalt
  onClose: () => void; // Callback
};

function Card({ title, subtitle, children, onClose }: CardProps) { … }
```

Ob du `type` oder `interface` nimmst, ist Geschmackssache – wichtig ist, dass jede Komponente ihre Props beschreibt.

## Native Props übernehmen

Eine eigene Komponente, die ein HTML-Element umhüllt, soll oft alle seine Attribute akzeptieren. **`ComponentProps<'button'>`** liefert alle Props eines `<button>`:

```tsx
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'danger' };

function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return <button {...rest} className={`btn btn-${variant} ${className ?? ''}`} />;
}

<Button type="submit" disabled={saving} aria-label="Speichern" />;
```

Mit `...rest` reichst du alles weiter, was du nicht selbst brauchst – auch `ref`, das seit React 19 eine normale Prop ist.

## Events

| Event | Typ des Handlers |
|---|---|
| `onClick` | `(e: MouseEvent<HTMLButtonElement>) => void` |
| `onChange` (Input) | `(e: ChangeEvent<HTMLInputElement>) => void` |
| `onSubmit` | `(e: FormEvent<HTMLFormElement>) => void` |
| `onKeyDown` | `(e: KeyboardEvent<HTMLElement>) => void` |

Schreibst du den Handler direkt ins JSX (`onChange={(e) => …}`), leitet TypeScript den Typ selbst ab.

## Discriminated Unions

Manche Props schließen sich gegenseitig aus. Eine **Discriminated Union** beschreibt das genau:

```tsx
type Status = { status: 'loading' } | { status: 'error'; message: string } | { status: 'done'; count: number };

function StatusLine(props: Status) {
  if (props.status === 'error') return <p>Fehler: {props.message}</p>; // message ist bekannt
  …
}
```

`<StatusLine status="error" />` ohne `message` ist dann ein Fehler – genau wie `<StatusLine status="loading" count={3} />`.

## Generische Komponenten

Eine Komponente kann mit beliebigen Datentypen arbeiten und trotzdem typsicher sein:

```tsx
type ListProps<T> = { items: T[]; renderItem: (item: T) => ReactNode; getKey: (item: T) => Key };

function List<T>({ items, renderItem, getKey }: ListProps<T>) {
  return <ul>{items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}

<List items={users} getKey={(u) => u.id} renderItem={(u) => u.name} />; // u ist ein User
```

::tryit{typescript-patterns}
