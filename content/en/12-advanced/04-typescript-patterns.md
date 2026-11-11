---
title: TypeScript Patterns
minutes: 9
summary: |-
  - Every component describes its props with `type` or `interface`: optional ones with `?`, arbitrary content as `ReactNode`, callbacks e.g. as `() => void`.
  - `ComponentProps<'button'>` adopts all props of a native element. With `...rest` you pass them on – including `ref`, which has been a normal prop since React 19.
  - Type event handlers with `MouseEvent<HTMLButtonElement>`, `ChangeEvent<HTMLInputElement>` or `SubmitEvent<HTMLFormElement>`. If the handler is written inline in JSX, TypeScript infers the type itself.
  - Discriminated unions describe mutually exclusive props: after `props.status === 'error'`, TypeScript knows that `message` exists.
  - Generic components like `List<T>` work with any data type and still stay type-safe.

  ```tsx
  import type { ComponentProps } from 'react';

  type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'danger' };

  function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
    return <button {...rest} className={`btn btn-${variant} ${className ?? ''}`} />;
  }

  <Button type="submit" disabled={saving} aria-label="Save" />;
  ```
quiz:
  - question: "How do you give your own button component all the props of a regular `<button>`?"
    options: ["With `ComponentProps<'button'>`","With `any`","By writing out every prop individually","You can't"]
    answer: 0
  - question: "Which type fits `children` when any JSX should be allowed?"
    options: ["`JSX.Element`", "`ReactNode`", "`string`", "`HTMLElement`"]
    answer: 1
    explanation: "`ReactNode` covers JSX, strings, numbers, `null`, and arrays of these – everything React can render."
  - question: "What is the advantage of a discriminated union like `{ status: 'error'; message: string } | { status: 'done'; count: number }`?"
    options: ["It is shorter","It makes props optional","After checking `status`, TypeScript knows which other props exist","There is none"]
    answer: 2
exercise:
  example: ex-typescript
  title: A Versatile Button
  task: |-
    1. `Button` accepts all props of a native `<button>` plus `variant`: `ComponentProps<'button'> & { variant?: 'primary' | 'danger' }`.
    2. It passes all other props on to the `<button>` (`type`, `disabled`, `onClick`, `aria-label` …).
    3. The class is `btn btn-primary` or `btn btn-danger` (default: primary).

    Afterwards, remove the line with `@ts-expect-error` in `App.tsx`.
  checks:
    variant-class: The class matches the variant
    passes-props: "`type`, `disabled`, `aria-label`, and `title` arrive on the `<button>`"
    onclick-works: "**Delete** deletes the account and disables the button"
---

# TypeScript Patterns

TypeScript and React work great together: props are checked, editors suggest matching values, and many errors are caught before the code runs. A few patterns come up again and again.

## Typing props

```tsx
type CardProps = {
  title: string;
  subtitle?: string; // optional
  children: ReactNode; // any content
  onClose: () => void; // callback
};

function Card({ title, subtitle, children, onClose }: CardProps) { … }
```

Whether you use `type` or `interface` is a matter of taste – what matters is that every component describes its props.

## Reusing native props

A custom component that wraps an HTML element often should accept all of its attributes. **`ComponentProps<'button'>`** gives you all the props of a `<button>`:

```tsx
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'danger' };

function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return <button {...rest} className={`btn btn-${variant} ${className ?? ''}`} />;
}

<Button type="submit" disabled={saving} aria-label="Save" />;
```

With `...rest` you pass on everything you don't need yourself – including `ref`, which has been a regular prop since React 19.

## Events

| Event | Handler type |
|---|---|
| `onClick` | `(e: MouseEvent<HTMLButtonElement>) => void` |
| `onChange` (input) | `(e: ChangeEvent<HTMLInputElement>) => void` |
| `onSubmit` | `(e: SubmitEvent<HTMLFormElement>) => void` |
| `onKeyDown` | `(e: KeyboardEvent<HTMLElement>) => void` |

If you write the handler directly in the JSX (`onChange={(e) => …}`), TypeScript infers the type itself.

## Discriminated unions

Some props are mutually exclusive. A **discriminated union** describes that precisely:

```tsx
type Status = { status: 'loading' } | { status: 'error'; message: string } | { status: 'done'; count: number };

function StatusLine(props: Status) {
  if (props.status === 'error') return <p>Error: {props.message}</p>; // message is known
  …
}
```

`<StatusLine status="error" />` without `message` is then an error – just like `<StatusLine status="loading" count={3} />`.

## Generic components

A component can work with any data type and still be type-safe:

```tsx
type ListProps<T> = { items: T[]; renderItem: (item: T) => ReactNode; getKey: (item: T) => Key };

function List<T>({ items, renderItem, getKey }: ListProps<T>) {
  return <ul>{items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}

<List items={users} getKey={(u) => u.id} renderItem={(u) => u.name} />; // u is a User
```

::tryit{typescript-patterns}
