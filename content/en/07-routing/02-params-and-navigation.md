---
title: Params and Navigation
minutes: 8
summary: |-
  - A colon turns a segment into a parameter: `path="/products/:id"`. With `?` a segment becomes optional (`/:lang?/about`).
  - `useParams()` returns the parameters as an object – always as **strings**. Convert for numbers: `Number(id)`.
  - Expect that nothing may exist for the ID, and show a suitable message then.
  - `useNavigate()` navigates in code, e.g. after saving. `navigate(-1)` goes back, `{ replace: true }` replaces the history entry.
  - `useSearchParams()` works like `useState`, except the value lives after the `?` in the URL – ideal for filters and sorting.

  ```tsx
  function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find((p) => p.id === Number(id));

    if (!product) return <p>Product not found.</p>;
    return (
      <>
        <h2>{product.name}</h2>
        <button onClick={() => navigate('/products')}>Back to list</button>
      </>
    );
  }
  ```

  > [!TIP] For ordinary links, still use `<Link>` – it opens in a new tab with Ctrl+click and screen readers recognize it.
quiz:
  - question: "The route is `path=\"/products/:id\"` and the URL is `/products/42`. What does `useParams()` return?"
    options: ["`{ id: '42' }`","`{ id: 42 }`","`42`","`['products', '42']`"]
    answer: 0
    explanation: "URL params are always strings. If you need a number, convert it: `Number(id)`."
  - question: "After saving a form, how do you navigate to the overview from code?"
    options: ["`window.location.href = '/products'`", "`const navigate = useNavigate(); navigate('/products')`", "Render a `<Link>` in the event handler", "`history.push('/products')`"]
    answer: 1
  - question: "What are search params like `?sort=price` good for?"
    options: ["For secret data","For the route itself","For state that should live in the URL – e.g. filters and sorting that can be shared or bookmarked","Nothing, they are deprecated"]
    answer: 2
exercise:
  example: ex-params
  title: A product page
  task: |-
    1. In `ProductPage`, read the `id` with `useParams()` and show the matching product – not always the first one.
    2. For an unknown ID, show `<p id="not-found">Product not found</p>`.
    3. The **Back to list** button navigates to `/` with `useNavigate()`.
  checks:
    shows-product: The **Tea** link shows Tea on `/products/2`
    direct-url: "Opening `/products/3` directly shows Cocoa"
    not-found: "`/products/42` shows **Product not found**"
    back-button: "**Back to list** leads back to the list"
---

# Params and Navigation

Many pages differ only by a value in the URL: `/products/1`, `/products/2` … That's what **URL params** are for.

## URL params with useParams

A colon in the path turns a segment into a param:

```tsx
<Route path="/products/:id" element={<ProductPage />} />
```

In the component, you read it with **`useParams`**:

```tsx
import { useParams } from 'react-router';

function ProductPage() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <p>Product not found.</p>;
  return <h2>{product.name}</h2>;
}
```

Params are always **strings** – even if they look like numbers. Expect that nothing exists for the ID, and show a suitable message in that case.

A route can have multiple params (`/users/:userId/posts/:postId`), and a `?` makes segments optional (`/:lang?/about`).

## Navigating from code with useNavigate

Not every navigation is a click on a link. After saving, logging in or deleting, you navigate from code:

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

- `navigate(-1)` goes one step back, like the Back button.
- `navigate('/login', { replace: true })` replaces the current entry in the history.

> [!TIP]
> For ordinary links, still use `<Link>`: it's a real link that you can open in a new tab with Ctrl+click and that screen readers recognize as a link.

## Search params with useSearchParams

The part after the `?` is suited for state that should live in the URL – filters, sorting, page number. That way the view can be shared or bookmarked:

```tsx
import { useSearchParams } from 'react-router';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort'); // "price" or null

  return <button onClick={() => setSearchParams({ sort: 'price' })}>By price</button>;
}
```

`useSearchParams` works like `useState`, except that the value lives in the URL.

::tryit{route-params}
