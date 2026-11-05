---
title: use() und Suspense
minutes: 8
summary: |-
  - `<Suspense fallback={…}>` zeigt einen Platzhalter, solange eine Komponente darin noch wartet. Grenzen lassen sich verschachteln.
  - `use(promise)` liest den Wert eines Promise; ist es noch offen, **suspendiert** die Komponente.
  - Die Komponente beschreibt nur den fertigen Zustand – kein Ladezustand, kein Effekt, kein State. Ein abgelehntes Promise landet bei der nächsten Error Boundary.
  - Anders als andere Hooks darf `use` in `if` und Schleifen stehen und liest auch Context.
  - Mit `useTransition` bleibt beim Wechsel der alte Inhalt sichtbar, bis der neue fertig ist; `isPending` zeigt, dass geladen wird.

  ```tsx
  function Profile({ userPromise }: { userPromise: Promise<User> }) {
    const user = use(userPromise);
    return <h2>{user.name}</h2>;
  }

  <Suspense fallback={<p>Lädt …</p>}>
    <Profile userPromise={userPromise} />
  </Suspense>
  ```

  > [!WARNING] Kein `use(fetch(…))` in derselben Komponente – das Promise muss gecacht sein, sonst suspendiert sie endlos.
quiz:
  - question: "Was passiert, wenn eine Komponente `use(promise)` aufruft und das Promise noch nicht erfüllt ist?"
    options: ["Sie gibt `undefined` zurück", "Sie „suspendiert“ – die nächste `<Suspense>`-Grenze zeigt ihr Fallback", "Sie wirft einen Fehler, der die App beendet", "Sie wartet blockierend"]
    answer: 1
  - question: "Warum darf das Promise für `use()` nicht bei jedem Rendern neu erzeugt werden?"
    options: ["Weil Promises teuer sind","Weil `use()` nur Strings annimmt","Weil jedes neue Promise wieder suspendiert – die Komponente käme nie zum Ende","Das darf es"]
    answer: 2
    explanation: "Das Promise muss gecacht sein, z. B. in einem Modul-Cache, einer Bibliothek oder einer Server Component."
  - question: "Wie verhinderst du, dass beim Wechsel auf neue Daten wieder das Fallback erscheint?"
    options: ["Gar nicht","Mit `useEffect`","Mit `memo`","Mit `startTransition` bzw. `useTransition`"]
    answer: 3
exercise:
  example: ex-suspense
  title: Ein Buch mit Suspense laden
  task: |-
    1. Lies das Buch in `BookDetails` mit `use(bookPromise)` und zeige den Titel in `#book`.
    2. Umhülle `BookDetails` mit `<Suspense>` und dem Fallback `<p id="fallback">Loading book …</p>`.

    `getBook` cacht die Promises bereits – du kannst es direkt beim Rendern aufrufen.
  checks:
    shows-book: Das erste Buch (**Dune**) erscheint
    shows-fallback: Beim Wechsel erscheint das Fallback, dann **Foundation**
    uses-use: "Gelesen wird mit `use()` innerhalb von `<Suspense>`, ohne `useEffect`"
---

# use() und Suspense

Mit **Suspense** beschreibst du Ladezustände deklarativ: Eine Komponente sagt „ich warte noch“, und eine umgebende `<Suspense>`-Grenze zeigt so lange einen Platzhalter.

## Suspense

```tsx
import { Suspense } from 'react';

<Suspense fallback={<p>Lädt …</p>}>
  <Profile userPromise={userPromise} />
</Suspense>
```

Solange irgendeine Komponente innerhalb der Grenze noch wartet, zeigt React das `fallback`. Sind alle fertig, erscheint der Inhalt auf einmal. Du kannst Grenzen verschachteln, um Teile der Seite unabhängig voneinander zu laden.

## use()

Mit **`use`** liest eine Komponente den Wert eines Promise. Ist es noch nicht erfüllt, **suspendiert** sie:

```tsx
import { use } from 'react';

function Profile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);
  return <h2>{user.name}</h2>;
}
```

Kein Ladezustand, kein Effekt, kein State: Die Komponente beschreibt nur den fertigen Zustand. Wird das Promise abgelehnt, landet der Fehler bei der nächsten **Error Boundary** (nächste Lektion).

> [!WARNING]
> Erzeuge das Promise nicht direkt in derselben Komponente (`use(fetch(…))`). Bei jedem Rendern entstünde ein neues Promise, und die Komponente würde endlos suspendieren. Das Promise muss **gecacht** sein: in einem Modul-Cache wie im Beispiel, in einer Bibliothek oder als Prop aus einer Server Component.

`use` ist besonders: Anders als andere Hooks darf es auch in `if`-Blöcken und Schleifen stehen. Es liest übrigens auch Context: `use(ThemeContext)`.

## Transitions: Alten Inhalt behalten

Wechselst du auf Daten, die noch laden, ersetzt React den sichtbaren Inhalt wieder durch das Fallback. Oft ist es angenehmer, den alten Inhalt stehen zu lassen, bis der neue fertig ist. Dafür markierst du die Änderung als **Transition**:

```tsx
const [isPending, startTransition] = useTransition();

<button onClick={() => startTransition(() => setUserId(2))}>Nächster</button>
{isPending && <Spinner />}
```

::tryit{suspense-use}

> [!NOTE]
> Woher kommen gecachte Promises in der Praxis? Frameworks wie Next.js reichen sie aus Server Components herein, und Bibliotheken wie TanStack Query bieten eigene Suspense-Hooks (`useSuspenseQuery`).
