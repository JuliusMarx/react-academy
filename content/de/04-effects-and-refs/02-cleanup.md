---
title: Aufräumen
minutes: 8
summary: |-
  - Startet ein Effekt etwas, das weiterläuft, gibt er eine **Cleanup-Funktion** zurück, die es wieder beendet.
  - React ruft sie auf, bevor der Effekt erneut läuft, und wenn die Komponente entfernt wird (Unmount).
  - Typische Paare: `setInterval`/`clearInterval`, `addEventListener`/`removeEventListener`, verbinden/trennen, abonnieren/abbestellen.
  - Ändert sich eine Abhängigkeit, räumt React erst mit den alten Werten auf und startet dann mit den neuen.
  - Im Entwicklungsmodus läuft unter `StrictMode` Effekt → Cleanup → Effekt, damit fehlendes Aufräumen sofort auffällt. Im fertigen Build läuft der Effekt einmal.

  ```tsx
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect(); // trennt den alten Raum
  }, [roomId]);
  ```

  > [!NOTE] Umgehe das doppelte Starten nicht mit einer „schon gestartet“-Variable – räume stattdessen sauber auf.
quiz:
  - question: "Wann ruft React die Cleanup-Funktion eines Effekts auf?"
    options: ["Nur beim Neuladen der Seite", "Bevor der Effekt erneut läuft und wenn die Komponente entfernt wird", "Nach jedem Klick", "Nie automatisch"]
    answer: 1
  - question: "Warum startet ein Effekt im Entwicklungsmodus zweimal?"
    options: ["Ein Bug in Vite","Weil das Abhängigkeits-Array fehlt","StrictMode baut die Komponente testweise auf, ab und wieder auf, um fehlendes Aufräumen sichtbar zu machen","Das passiert auch im fertigen Build"]
    answer: 2
exercise:
  example: ex-timer
  title: Eine Stoppuhr
  task: |-
    1. Solange `running` wahr ist, erhöht ein `setInterval` jede Sekunde `seconds` um 1.
    2. Gib eine Cleanup-Funktion zurück, die das Intervall beendet – sonst läuft die Uhr nach **Stop** weiter.

    Tipp: Mit `setSeconds((s) => s + 1)` muss `seconds` nicht in die Abhängigkeiten.
  checks:
    counts: Nach **Start** zählt die Uhr einmal pro Sekunde
    stops: Nach **Stop** bleibt sie stehen
    resets: "**Reset** setzt sie auf 0"
---

# Aufräumen

Viele Effekte starten etwas, das weiterläuft: einen Timer, einen Event-Listener, eine Verbindung. Das muss wieder beendet werden, wenn es nicht mehr gebraucht wird. Dafür gibt der Effekt eine **Cleanup-Funktion** zurück.

## Die Cleanup-Funktion

```tsx
useEffect(() => {
  const id = setInterval(() => setTime(new Date()), 1000);
  return () => clearInterval(id);
}, []);
```

React ruft die Cleanup-Funktion auf,

- **bevor der Effekt erneut läuft**, weil sich eine Abhängigkeit geändert hat, und
- **wenn die Komponente entfernt wird** (Unmount).

So passt jedes „Start“ zu genau einem „Stopp“.

## Typische Paare

| Im Effekt | In der Cleanup-Funktion |
|---|---|
| `setInterval` / `setTimeout` | `clearInterval` / `clearTimeout` |
| `addEventListener` | `removeEventListener` |
| Verbindung öffnen | Verbindung schließen |
| Abonnieren | Abo beenden |

```tsx
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);
```

## Abhängigkeiten und Cleanup

Ändert sich eine Abhängigkeit, räumt React erst mit den **alten** Werten auf und startet den Effekt dann mit den **neuen**:

```tsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();
  return () => connection.disconnect(); // trennt den alten Raum
}, [roomId]);
```

## StrictMode: Effekte laufen zweimal

Im Entwicklungsmodus baut `StrictMode` jede Komponente nach dem ersten Rendern einmal ab und wieder auf: Effekt → Cleanup → Effekt. Fehlt das Aufräumen, fällt es dadurch sofort auf – zum Beispiel, weil ein Timer doppelt so schnell läuft.

> [!NOTE]
> Das ist kein Fehler, den du umgehen solltest (etwa mit einer Variable „schon gestartet“). Sorge stattdessen dafür, dass die Cleanup-Funktion den Effekt sauber rückgängig macht. Im fertigen Build läuft der Effekt nur einmal.

::tryit{effect-cleanup}
