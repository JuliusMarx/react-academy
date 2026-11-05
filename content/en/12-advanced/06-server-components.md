---
title: Server Components and Frameworks
minutes: 8
summary: |-
  - With server-side rendering (SSR), the server generates finished HTML for each request; React then makes it interactive in the browser (hydration). If the HTML is generated at build time, that's static site generation (SSG).
  - Server Components run only on the server – their code never reaches the browser. They may be `async` and load data directly.
  - They have no state and no event handlers. Anything interactive lives in Client Components, marked with `'use client'` at the top of the file; they receive serializable props.
  - `'use server'` marks Server Functions that the client can call, e.g. as a form action.
  - Server Components need a framework like Next.js. A plain Vite app is still a good choice for apps behind a login, tools and dashboards.

  ```tsx
  export default async function ProductsPage() {
    const products = await db.product.findMany();
    return (
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} <AddToCartButton id={p.id} />
          </li>
        ))}
      </ul>
    );
  }
  ```

  > [!WARNING] Every Server Function is a public endpoint – always check inside it whether the user is signed in and allowed to perform the action.
quiz:
  - question: "Where do React Server Components run?"
    options: ["Only in the browser", "On the server (or at build time) – their code never reaches the browser", "In a web worker", "In the database"]
    answer: 1
  - question: "What does `'use client'` at the top of a file mean?"
    options: ["The file only runs on the server","The file is not built","From here on, Client Components begin, which are interactive in the browser – with state, effects, and event handlers","The component loads data"]
    answer: 2
  - question: "What does the React team recommend for new multi-page apps?"
    options: ["Always go without a framework","jQuery","Only class components","A framework like Next.js"]
    answer: 3
---

# Server Components and Frameworks

Everything in this course ran in the browser: the app loads, renders, and fetches its own data. But React can also render on the **server**. That is the foundation of modern React frameworks.

## Server rendering

With **server-side rendering** (SSR), the server produces finished HTML for every request. The browser shows content right away, then React takes over in the browser (**hydration**) and makes the page interactive. If the HTML is already generated at build time, it's called **static site generation** (SSG) – which, by the way, is how this learning platform works too.

## React Server Components

**Server Components** go one step further: they run **only** on the server. Their code and their dependencies never reach the browser.

```tsx
// app/products/page.tsx – a Server Component (the default in Next.js)
import { db } from '@/lib/db';

export default async function ProductsPage() {
  const products = await db.product.findMany(); // query the database directly
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.name} <AddToCartButton id={p.id} />
        </li>
      ))}
    </ul>
  );
}
```

- Server Components may be **`async`** and load data directly – no effect, no loading state, no API in between.
- They have **no state and no event handlers**. Everything interactive lives in **Client Components**.

```tsx
// AddToCartButton.tsx
'use client';

import { useState } from 'react';

export default function AddToCartButton({ id }: { id: number }) {
  const [added, setAdded] = useState(false);
  return <button onClick={() => setAdded(true)}>{added ? 'In cart' : 'Add to cart'}</button>;
}
```

`'use client'` marks the boundary: this file and everything it imports runs (also) in the browser. A Server Component can render Client Components and pass them serializable props.

## Server Functions

With `'use server'` you mark functions that run on the server but can be called from the client – for example as a form action (Chapter 8):

```tsx
async function addToCart(formData: FormData) {
  'use server';
  await db.cart.add(String(formData.get('id')));
}

<form action={addToCart}>…</form>;
```

> [!WARNING]
> Every Server Function is a public endpoint. Always check inside it whether the user is signed in and allowed to perform the action.

## Which framework?

Server Components need a framework that brings the server and the bundler together. For new multi-page apps, the React team explicitly recommends using a framework:

| Framework | Highlights |
|---|---|
| **Next.js** | Server Components, App Router with file-based routes, Server Functions, widely used |
| **React Router** (Framework Mode) | Loaders and actions as in Chapter 7, server rendering, file-based routes |
| **Expo** | React Native for iOS, Android, and the web |

A plain Vite app like the one in this course is still a good choice for applications behind a login, tools, and dashboards – anywhere search engines and the very first load time matter less.

## What's next?

You now know the foundation: components, state, effects, hooks, data fetching, routing, forms, styling, state management, and testing. Everything frameworks offer builds on it. A good next step: build a small project of your own – and then try out a framework like Next.js or React Router.
