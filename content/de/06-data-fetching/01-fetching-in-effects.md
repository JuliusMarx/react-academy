---
title: Daten im Effekt laden
minutes: 9
quiz:
  - question: "Der Nutzer wechselt schnell von Profil 1 zu Profil 2. Die Antwort für Profil 1 kommt zuletzt an. Was zeigt eine Komponente ohne Cleanup?"
    options: ["Profil 2","Nichts","Einen Fehler","Profil 1 – die veraltete Antwort überschreibt die aktuelle"]
    answer: 3
    explanation: "Das ist eine Race Condition. Mit einer `ignore`-Variable oder einem `AbortController` in der Cleanup-Funktion verwirfst du veraltete Antworten."
  - question: "Warum prüfst du bei `fetch` zusätzlich `res.ok`?"
    options: ["`fetch` wirft bei HTTP-Fehlern wie 404 keinen Fehler", "Weil `res.json()` sonst langsamer ist", "Das ist nicht nötig", "Nur bei POST-Anfragen"]
    answer: 0
  - question: "Was ist ein Nachteil, Daten direkt in Effekten zu laden?"
    options: ["Es funktioniert nicht mit TypeScript", "Kein Caching – jede Komponente lädt erneut, und Ladezustände, Fehler und Race Conditions musst du selbst behandeln", "Effekte können kein `fetch` aufrufen", "Es gibt keinen"]
    answer: 1
exercise:
  example: ex-fetch-effect
  title: Ein Profil laden
  task: |-
    `Profile` lädt einen Nutzer mit `fetchUser`. Die Antworten kommen unterschiedlich schnell – Nutzer 1 braucht am längsten.

    1. Zeige während des Ladens `<p id="loading">Loading …</p>` – auch beim Wechsel auf einen anderen Nutzer.
    2. Schlägt `fetchUser` fehl, zeige `<p id="error">` mit der Fehlermeldung.
    3. Behebe die Race Condition: Wechselt `userId`, bevor die alte Antwort da ist, wird sie ignoriert.
  checks:
    loads-user: Nutzer 1 wird geladen und angezeigt
    shows-loading: Beim Wechsel erscheint `#loading` statt des alten Nutzers
    shows-error: Bei Nutzer 4 erscheint **User not found**
    no-race: Nach schnellem Wechsel 1 → 2 steht Nutzer 2 da
---

# Daten im Effekt laden

Die einfachste Art, Daten vom Server zu holen: ein `fetch` in einem Effekt. Dabei lernst du die Probleme kennen, die jede Lösung für das Datenladen lösen muss – auch die Bibliotheken, die du später einsetzt.

## Laden, Ladezustand, Fehler

```tsx
function Profile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUser(null);
    setError(null);
    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setUser)
      .catch((e) => setError(e.message));
  }, [userId]);

  if (error) return <p role="alert">{error}</p>;
  if (!user) return <p>Lädt …</p>;
  return <h2>{user.name}</h2>;
}
```

Drei Zustände musst du abbilden: **lädt**, **Fehler**, **fertig**.

> [!WARNING]
> `fetch` wirft bei HTTP-Fehlern wie 404 oder 500 *keinen* Fehler – nur bei Netzwerkproblemen. Prüfe deshalb immer `res.ok`.

> [!NOTE]
> Vorsicht beim Testen mit dem Vite-Dev-Server: Er beantwortet unbekannte Pfade standardmäßig mit der `index.html` und Status **200** (SPA-Fallback). Eine fehlende JSON-Datei ergibt dann keinen 404, sondern einen Fehler beim Parsen. Im Beispiel schaltet `appType: 'mpa'` in der `vite.config.ts` das ab.

## Race Conditions

Wechselt `userId` schnell von 1 auf 2, laufen zwei Anfragen gleichzeitig. Kommt die Antwort für Nutzer 1 *zuletzt*, überschreibt sie den richtigen Nutzer 2. Die Lösung ist eine Cleanup-Funktion, die veraltete Antworten verwirft:

```tsx
useEffect(() => {
  let ignore = false;
  fetchUser(userId).then((data) => {
    if (!ignore) setUser(data);
  });
  return () => {
    ignore = true; // dieser Effekt ist veraltet
  };
}, [userId]);
```

Alternativ brichst du die Anfrage mit einem **`AbortController`** ganz ab:

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setUser)
    .catch((e) => {
      if (e.name !== 'AbortError') setError(e.message);
    });
  return () => controller.abort();
}, [userId]);
```

## Die Grenzen dieses Ansatzes

Für kleine Apps reicht das. Für größere fehlt einiges:

- **Kein Caching**: Jede Komponente lädt erneut, auch wenn die Daten schon da sind.
- **Wasserfälle**: Kinder starten ihre Anfrage erst, wenn das Elternteil fertig geladen hat.
- **Viel Handarbeit**: Ladezustand, Fehler, Abbruch, erneutes Laden – in jeder Komponente.

Deshalb nimmst du in echten Projekten meist eine Bibliothek wie **TanStack Query** (Lektion 4) oder die Datenlade-Funktionen eines Frameworks.

::tryit{fetch-effect}
