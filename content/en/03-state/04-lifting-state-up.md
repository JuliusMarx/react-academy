---
title: Sharing State
minutes: 8
quiz:
  - question: "Two sibling components should display and change the same value. Where does the state belong?"
    options: ["In both components, kept in sync", "In the closest common parent component", "In a global variable", "In `localStorage`"]
    answer: 1
  - question: "How does a child change state that belongs to its parent component?"
    options: ["It changes the prop directly","With `this.parent.setState`","It calls a function it received as a prop","It can't"]
    answer: 2
exercise:
  example: ex-temperature
  title: A Temperature Converter
  task: |-
    Both input fields have their own state and know nothing about each other.

    1. Move the state up to `App`: remember the most recently entered value and its scale.
    2. `TemperatureInput` receives `value` and `onChange` as props. The other field shows the converted value (`convert(value, toFahrenheit)` or `convert(value, toCelsius)`).
    3. Pass `BoilingVerdict` the temperature in Celsius.
  checks:
    celsius-to-fahrenheit: 100 °C gives 212 °F
    fahrenheit-to-celsius: 32 °F gives 0 °C
    verdict: "`#verdict` says whether water would boil"
---

# Sharing State

Sometimes two components should use the same state – for example an accordion where only one panel is open at a time. In that case, you **move the state up** (*lifting state up*) to the closest common parent component.

## The problem

If each panel has its own `isActive` state, both can be open at the same time – neither knows about the other:

```tsx
function Panel({ title, children }: PanelProps) {
  const [isActive, setIsActive] = useState(false); // each panel on its own
  // …
}
```

## The solution in three steps

1. **Remove the state from the child.**
2. **Pass it as props**: the value (`isActive`) and a function that changes it (`onShow`).
3. **Create the state in the parent component.**

```tsx
function Panel({ title, isActive, onShow, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
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

Now `Panel` is **controlled**: the parent component decides whether it's open. The child only reports “I want to be shown”.

## Data flows down, events flow up

This is the basic pattern of every React app:

- **Data** flows from top to bottom through props.
- **Change requests** go from bottom to top through callback props (`onShow`, `onChange`).

Each value has a **single source of truth** – the component that owns the state. Everyone else receives it as props.

> [!TIP]
> If the common parent is very far up and you'd have to pass props through many levels, **context** helps (chapter 5).

::tryit{lifting-state}
