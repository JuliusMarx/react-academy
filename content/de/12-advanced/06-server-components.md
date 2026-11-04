---
title: Server Components und Frameworks
minutes: 8
quiz:
  - question: "Wo laufen React Server Components?"
    options: ["Nur im Browser", "Auf dem Server (oder beim Build) – ihr Code kommt gar nicht im Browser an", "In einem Web Worker", "In der Datenbank"]
    answer: 1
  - question: "Wofür steht `'use client'` am Anfang einer Datei?"
    options: ["Die Datei läuft nur auf dem Server","Die Datei wird nicht gebaut","Ab hier beginnen Client-Komponenten, die im Browser interaktiv sind – mit State, Effekten und Event-Handlern","Die Komponente lädt Daten"]
    answer: 2
  - question: "Was empfiehlt das React-Team für neue Apps mit mehreren Seiten?"
    options: ["Immer ohne Framework","jQuery","Nur Klassenkomponenten","Ein Framework wie Next.js oder React Router (Framework Mode)"]
    answer: 3
---

# Server Components und Frameworks

Alles in diesem Kurs lief im Browser: Die App lädt, rendert und holt sich ihre Daten. React kann aber auch auf dem **Server** rendern. Das ist die Grundlage moderner React-Frameworks.

## Server-Rendering

Beim **Server-Side Rendering** (SSR) erzeugt der Server für jede Anfrage fertiges HTML. Der Browser zeigt sofort Inhalt an, danach übernimmt React im Browser (**Hydration**) und macht die Seite interaktiv. Wird das HTML schon beim Build erzeugt, heißt das **Static Site Generation** (SSG) – so funktioniert übrigens auch diese Lernplattform.

## React Server Components

**Server Components** gehen einen Schritt weiter: Sie laufen **nur** auf dem Server. Ihr Code und ihre Abhängigkeiten kommen nie im Browser an.

```tsx
// app/products/page.tsx – eine Server Component (Standard in Next.js)
import { db } from '@/lib/db';

export default async function ProductsPage() {
  const products = await db.product.findMany(); // direkt auf die Datenbank zugreifen
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

- Server Components dürfen **`async`** sein und Daten direkt laden – kein Effekt, kein Ladezustand, keine API dazwischen.
- Sie haben **keinen State und keine Event-Handler**. Alles Interaktive steckt in **Client Components**.

```tsx
// AddToCartButton.tsx
'use client';

import { useState } from 'react';

export default function AddToCartButton({ id }: { id: number }) {
  const [added, setAdded] = useState(false);
  return <button onClick={() => setAdded(true)}>{added ? 'Im Warenkorb' : 'In den Warenkorb'}</button>;
}
```

`'use client'` markiert die Grenze: Diese Datei und alles, was sie importiert, läuft (auch) im Browser. Eine Server Component kann Client Components rendern und ihnen serialisierbare Props übergeben.

## Server Functions

Mit `'use server'` markierst du Funktionen, die auf dem Server laufen, aber vom Client aufgerufen werden können – etwa als Form Action (Kapitel 8):

```tsx
async function addToCart(formData: FormData) {
  'use server';
  await db.cart.add(String(formData.get('id')));
}

<form action={addToCart}>…</form>;
```

> [!WARNING]
> Jede Server Function ist ein öffentlicher Endpunkt. Prüfe darin immer, ob der Nutzer angemeldet ist und die Aktion ausführen darf.

## Welches Framework?

Server Components brauchen ein Framework, das Server und Bundler zusammenbringt. Das React-Team empfiehlt für neue Apps mit mehreren Seiten ausdrücklich ein Framework:

| Framework | Besonderheiten |
|---|---|
| **Next.js** | Server Components, App Router mit dateibasierten Routen, Server Functions, weit verbreitet |
| **React Router** (Framework Mode) | Loader und Actions wie in Kapitel 7, Server-Rendering, dateibasierte Routen |
| **Expo** | React Native für iOS, Android und das Web |

Eine reine Vite-App wie in diesem Kurs ist weiterhin eine gute Wahl für Anwendungen hinter einem Login, Werkzeuge und Dashboards – überall, wo Suchmaschinen und die allererste Ladezeit weniger zählen.

## Wie geht es weiter?

Du kennst jetzt das Fundament: Komponenten, State, Effekte, Hooks, Datenladen, Routing, Formulare, Styling, State Management und Tests. Alles, was Frameworks bieten, baut darauf auf. Ein guter nächster Schritt: Baue ein eigenes kleines Projekt – und probiere danach ein Framework wie Next.js oder React Router aus.
