---
title: Parameter und Navigation
minutes: 8
summary: |-
  - Ein Doppelpunkt macht ein Segment zum Parameter: `path="/products/:id"`. Mit `?` wird ein Segment optional (`/:lang?/about`).
  - `useParams()` liefert die Parameter als Objekt – immer als **Strings**. Für Zahlen wandelst du um: `Number(id)`.
  - Rechne damit, dass es zur ID nichts gibt, und zeige dann eine passende Meldung.
  - `useNavigate()` navigiert per Code, z. B. nach dem Speichern. `navigate(-1)` geht zurück, `{ replace: true }` ersetzt den Historien-Eintrag.
  - `useSearchParams()` funktioniert wie `useState`, nur steht der Wert nach dem `?` in der URL – ideal für Filter und Sortierung.

  ```tsx
  function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find((p) => p.id === Number(id));

    if (!product) return <p>Produkt nicht gefunden.</p>;
    return (
      <>
        <h2>{product.name}</h2>
        <button onClick={() => navigate('/products')}>Zur Liste</button>
      </>
    );
  }
  ```

  > [!TIP] Für normale Verweise nimm trotzdem `<Link>` – er lässt sich mit Strg+Klick im neuen Tab öffnen und wird von Screenreadern erkannt.
quiz:
  - question: "Die Route ist `path=\"/products/:id\"`, die URL `/products/42`. Was liefert `useParams()`?"
    options: ["`{ id: '42' }`","`{ id: 42 }`","`42`","`['products', '42']`"]
    answer: 0
    explanation: "URL-Parameter sind immer Strings. Brauchst du eine Zahl, wandle sie um: `Number(id)`."
  - question: "Wie navigierst du nach dem Speichern eines Formulars per Code zur Übersicht?"
    options: ["`window.location.href = '/products'`", "`const navigate = useNavigate(); navigate('/products')`", "`<Link>` im Event-Handler rendern", "`history.push('/products')`"]
    answer: 1
  - question: "Wofür eignen sich Suchparameter wie `?sort=price`?"
    options: ["Für geheime Daten","Für die Route selbst","Für Zustand, der in der URL stehen soll – z. B. Filter und Sortierung, die man teilen oder als Lesezeichen speichern kann","Für nichts, sie sind veraltet"]
    answer: 2
exercise:
  example: ex-params
  title: Eine Produktseite
  task: |-
    1. Lies in `ProductPage` die `id` mit `useParams()` aus und zeige das passende Produkt – nicht immer das erste.
    2. Bei einer unbekannten ID zeige `<p id="not-found">Product not found</p>`.
    3. Der Button **Back to list** navigiert mit `useNavigate()` nach `/`.
  checks:
    shows-product: Der Link **Tea** zeigt Tea auf `/products/2`
    direct-url: "`/products/3` direkt aufgerufen zeigt Cocoa"
    not-found: "`/products/42` zeigt **Product not found**"
    back-button: "**Back to list** führt zurück zur Liste"
---

# Parameter und Navigation

Viele Seiten unterscheiden sich nur durch einen Wert in der URL: `/products/1`, `/products/2` … Dafür gibt es **URL-Parameter**.

## URL-Parameter mit useParams

Ein Doppelpunkt im Pfad macht ein Segment zum Parameter:

```tsx
<Route path="/products/:id" element={<ProductPage />} />
```

In der Komponente liest du ihn mit **`useParams`**:

```tsx
import { useParams } from 'react-router';

function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p>Produkt nicht gefunden.</p>;
  return <h2>{product.name}</h2>;
}
```

Parameter sind immer **Strings** – auch wenn sie wie Zahlen aussehen. Rechne damit, dass es zur ID nichts gibt, und zeige dann eine passende Meldung.

Eine Route kann mehrere Parameter haben (`/users/:userId/posts/:postId`), und mit `?` werden Segmente optional (`/:lang?/about`).

## Per Code navigieren mit useNavigate

Nicht jede Navigation ist ein Klick auf einen Link. Nach dem Speichern, Anmelden oder Löschen wechselst du per Code:

```tsx
import { useNavigate } from 'react-router';

function EditProduct() {
  const navigate = useNavigate();

  async function handleSave() {
    await saveProduct();
    navigate('/products');
  }
  // …
}
```

- `navigate(-1)` geht einen Schritt zurück, wie der Zurück-Button.
- `navigate('/login', { replace: true })` ersetzt den aktuellen Eintrag in der Historie.

> [!TIP]
> Für normale Verweise nimm trotzdem `<Link>`: Er ist ein echter Link, den man mit Strg+Klick in einem neuen Tab öffnen kann und den Screenreader als Link erkennen.

## Suchparameter mit useSearchParams

Der Teil nach dem `?` eignet sich für Zustand, der in der URL stehen soll – Filter, Sortierung, Seitenzahl. So kann man die Ansicht teilen oder als Lesezeichen speichern:

```tsx
import { useSearchParams } from 'react-router';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort'); // "price" oder null

  return <button onClick={() => setSearchParams({ sort: 'price' })}>Nach Preis</button>;
}
```

`useSearchParams` funktioniert wie `useState`, nur dass der Wert in der URL steht.

::tryit{route-params}
