---
title: Wann du keinen Effekt brauchst
minutes: 8
quiz:
  - question: "Aus `items` und `query` soll eine gefilterte Liste entstehen. Wie machst du das am besten?"
    options: ["Mit `useState` und einem `useEffect`, der die Liste aktualisiert", "Direkt beim Rendern berechnen: `const visible = items.filter(…)`", "In einem Ref speichern", "In `localStorage` ablegen"]
    answer: 1
  - question: "Wie setzt du den gesamten State einer Komponente zurück, wenn sich `userId` ändert?"
    options: ["Mit einem Effekt, der jeden State zurücksetzt","Mit `window.location.reload()`","Mit `key={userId}` an der Komponente","Gar nicht"]
    answer: 2
    explanation: "Ein anderer `key` bedeutet für React eine neue Komponente – der State beginnt von vorn."
  - question: "Nach einem Klick auf Kaufen soll eine Benachrichtigung erscheinen. Wo gehört der Code hin?"
    options: ["In einen Effekt, der auf den Warenkorb reagiert","In `main.tsx`","In die Komponente direkt beim Rendern","In den Event-Handler des Buttons"]
    answer: 3
exercise:
  example: ex-no-effect
  title: Effekt entfernen
  task: |-
    Die App kopiert die gefilterte Liste und die Zusammenfassung per `useEffect` in eigenen State. Das ist umständlich – und fehlerhaft: Neue Einträge erscheinen nicht, weil `items` in den Abhängigkeiten fehlt.

    Entferne den Effekt und den zusätzlichen State. Berechne `visible` und die Zusammenfassung direkt beim Rendern.
  checks:
    filters: Der Filter **ap** zeigt Apple und Grape, „2 of 4 shown“
    new-items: Neue Einträge erscheinen sofort
    no-effect: "`App.tsx` kommt ohne `useEffect` und ohne zusätzlichen State aus"
---

# Wann du keinen Effekt brauchst

Effekte sind ein Notausgang aus React – für die Synchronisation mit externen Systemen. Viele Effekte, die man in der Praxis sieht, sind überflüssig: Sie machen Code langsamer, umständlicher und fehleranfälliger. Hier die häufigsten Fälle und was du stattdessen tust.

## Werte ableiten statt synchronisieren

```tsx
// ✗ Unnötig: zusätzlicher State plus Effekt
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✓ Einfach beim Rendern berechnen
const fullName = `${firstName} ${lastName}`;
```

Die Effekt-Variante rendert erst mit dem alten Wert und dann gleich noch einmal. Die berechnete Variante ist immer aktuell – und kürzer.

Ist eine Berechnung wirklich teuer, merkst du dir das Ergebnis mit `useMemo` (Kapitel 5), statt es in State zu kopieren.

## State mit key zurücksetzen

Soll eine Komponente von vorn beginnen, wenn sich etwas ändert, gib ihr einen `key`:

```tsx
<Profile key={userId} userId={userId} />
```

Ändert sich `userId`, baut React `Profile` neu auf – mitsamt seinem State. Ein Effekt, der jeden State einzeln zurücksetzt, ist nicht nötig.

## Ereignisse gehören in Event-Handler

```tsx
// ✗ Effekt reagiert indirekt auf den Klick
useEffect(() => {
  if (product.isInCart) showNotification(`${product.name} im Warenkorb`);
}, [product]);

// ✓ Direkt dort, wo es passiert
function handleBuy() {
  addToCart(product);
  showNotification(`${product.name} im Warenkorb`);
}
```

Die Frage lautet: *Warum* soll der Code laufen? Weil der Nutzer etwas getan hat → Event-Handler. Weil die Komponente angezeigt wird und mit etwas synchron sein muss → Effekt.

## Ketten von Effekten vermeiden

Effekte, die State setzen, der den nächsten Effekt auslöst, sind schwer nachzuvollziehen. Berechne so viel wie möglich beim Rendern und fasse Änderungen im Event-Handler zusammen.

## Wann ein Effekt richtig ist

- Timer, Intervalle, Animationen
- Browser-APIs wie `resize`, `IntersectionObserver`, `document.title`
- Verbindungen (WebSocket, Chat) und Abos
- Nicht-React-Bibliotheken (Karten, Charts) einbinden

Daten laden ist auch ein Effekt – meist nimmst du dafür aber eine Bibliothek oder `use()` mit Suspense. Mehr dazu in Kapitel 6.

::tryit{no-effect}
