---
title: State teilen
minutes: 8
summary: |-
  - Sollen mehrere Komponenten denselben State nutzen, verlagerst du ihn in die nächste gemeinsame Elternkomponente (*lifting state up*).
  - Drei Schritte: State aus dem Kind entfernen, Wert und Änderungsfunktion als Props übergeben, State in der Elternkomponente anlegen.
  - Das Kind ist dann kontrolliert: Die Elternkomponente entscheidet, das Kind meldet nur Wünsche über Callback-Props wie `onShow`.
  - Daten fließen über Props nach unten, Ereignisse über Callbacks nach oben.
  - Für jeden Wert gibt es eine einzige Quelle der Wahrheit: die Komponente, die den State besitzt.

  ```tsx
  export default function Accordion() {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <>
        <Panel title="Info" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>…</Panel>
        <Panel title="Details" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>…</Panel>
      </>
    );
  }
  ```

  > [!TIP] Müsstest du Props durch sehr viele Ebenen reichen, hilft Context (Kapitel 5).
quiz:
  - question: "Zwei Geschwisterkomponenten sollen denselben Wert anzeigen und ändern. Wo gehört der State hin?"
    options: ["In beide Komponenten, synchron gehalten", "In die nächste gemeinsame Elternkomponente", "In eine globale Variable", "In `localStorage`"]
    answer: 1
  - question: "Wie ändert ein Kind State, der seiner Elternkomponente gehört?"
    options: ["Es ändert die Prop direkt","Mit `this.parent.setState`","Es ruft eine Funktion auf, die es als Prop bekommen hat","Gar nicht"]
    answer: 2
exercise:
  example: ex-temperature
  title: Ein Temperaturumrechner
  task: |-
    Beide Eingabefelder haben eigenen State und wissen nichts voneinander.

    1. Verlagere den State nach `App`: Merke dir den zuletzt eingegebenen Wert und seine Skala.
    2. `TemperatureInput` bekommt `value` und `onChange` als Props. Das jeweils andere Feld zeigt den umgerechneten Wert (`convert(value, toFahrenheit)` bzw. `convert(value, toCelsius)`).
    3. Gib `BoilingVerdict` die Temperatur in Celsius.
  checks:
    celsius-to-fahrenheit: 100 °C ergeben 212 °F
    fahrenheit-to-celsius: 32 °F ergeben 0 °C
    verdict: "`#verdict` sagt, ob Wasser kochen würde"
---

# State teilen

Manchmal sollen zwei Komponenten denselben State nutzen – etwa ein Akkordeon, bei dem immer nur ein Panel offen ist. Dann **verlagerst du den State nach oben** (*lifting state up*) in die nächste gemeinsame Elternkomponente.

## Das Problem

Hat jedes Panel seinen eigenen State `isActive`, können beide gleichzeitig offen sein – keines weiß vom anderen:

```tsx
function Panel({ title, children }: PanelProps) {
  const [isActive, setIsActive] = useState(false); // jedes Panel für sich
  // …
}
```

## Die Lösung in drei Schritten

1. **State aus dem Kind entfernen.**
2. **Als Props übergeben**: den Wert (`isActive`) und eine Funktion, die ihn ändert (`onShow`).
3. **State in der Elternkomponente anlegen.**

```tsx
function Panel({ title, isActive, onShow, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Anzeigen</button>}
    </section>
  );
}

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <Panel title="Info" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>…</Panel>
      <Panel title="Details" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>…</Panel>
    </>
  );
}
```

Jetzt ist `Panel` **kontrolliert**: Die Elternkomponente entscheidet, ob es offen ist. Das Kind meldet nur „ich möchte angezeigt werden“.

## Daten fließen nach unten, Ereignisse nach oben

Das ist das Grundmuster jeder React-App:

- **Daten** fließen über Props von oben nach unten.
- **Änderungswünsche** gehen über Callback-Props (`onShow`, `onChange`) von unten nach oben.

Für jeden Wert gibt es eine **einzige Quelle der Wahrheit** – die Komponente, die den State besitzt. Alle anderen bekommen ihn als Props.

> [!TIP]
> Liegt der gemeinsame Elternteil sehr weit oben und müsstest du Props durch viele Ebenen reichen, hilft **Context** (Kapitel 5).

::tryit{lifting-state}
