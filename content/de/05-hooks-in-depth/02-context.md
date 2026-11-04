---
title: Context
minutes: 8
quiz:
  - question: "Welches Problem löst Context?"
    options: ["Props durch viele Ebenen reichen zu müssen (Prop Drilling)","Langsame Komponenten","Fehlende Typen","Daten vom Server laden"]
    answer: 0
  - question: "Welchen Wert liefert `useContext(ThemeContext)`, wenn es keinen Provider darüber gibt?"
    options: ["`undefined`", "Den Standardwert aus `createContext`", "Einen Fehler", "Den Wert des nächsten Geschwisters"]
    answer: 1
  - question: "Wie stellst du in React 19 einen Context-Wert bereit?"
    options: ["`ThemeContext.set(theme)`","`provide(ThemeContext, theme)`","`<ThemeContext value={theme}>…</ThemeContext>`","`useContext(ThemeContext, theme)`"]
    answer: 2
    explanation: "Seit React 19 ist der Context selbst der Provider. Das ältere `<ThemeContext.Provider>` funktioniert weiterhin."
exercise:
  example: ex-context
  title: Ein Farbschema für alle Buttons
  task: |-
    1. `ThemedButton` bekommt das Farbschema noch als Prop. Lies es stattdessen mit `useContext(ThemeContext)` aus `src/theme.ts`.
    2. Stelle in `App` das aktuelle Farbschema mit `<ThemeContext value={…}>` für alles darunter bereit.
  checks:
    reads-context: "`ThemedButton` liest den Wert aus dem Context"
    default-light: Ohne Provider ist der Button **light**
    toggles: "**Toggle theme** schaltet beide Buttons auf **dark**"
---

# Context

Manche Daten brauchen viele Komponenten: das Farbschema, der angemeldete Nutzer, die Sprache. Sie über Props durch jede Ebene zu reichen (*Prop Drilling*) ist mühsam. **Context** macht einen Wert für einen ganzen Teilbaum verfügbar.

## In drei Schritten

**1. Context anlegen** – mit einem Standardwert:

```ts
import { createContext } from 'react';

export type Theme = 'light' | 'dark';
export const ThemeContext = createContext<Theme>('light');
```

**2. Wert bereitstellen** – alles innerhalb bekommt ihn:

```tsx
export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <ThemeContext value={theme}>
      <Layout />
    </ThemeContext>
  );
}
```

**3. Wert lesen** – in beliebiger Tiefe:

```tsx
import { useContext } from 'react';

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Speichern</button>;
}
```

Ändert sich der bereitgestellte Wert, rendern alle Komponenten neu, die ihn lesen.

## Regeln

- Ohne Provider darüber liefert `useContext` den **Standardwert** aus `createContext`.
- Gibt es mehrere Provider, gewinnt der **nächstgelegene** darüber.
- Seit React 19 ist `<ThemeContext value>` selbst der Provider. In älterem Code siehst du `<ThemeContext.Provider value>` – das funktioniert weiterhin.
- Mit `use(ThemeContext)` kannst du einen Context auch lesen – anders als `useContext` sogar innerhalb von `if`.

## State und Funktionen bereitstellen

Oft stellst du einen Wert *und* eine Funktion zum Ändern bereit, oder `state` und `dispatch` aus `useReducer`:

```tsx
const TasksContext = createContext<Task[]>([]);
const TasksDispatchContext = createContext<Dispatch<TaskAction>>(() => {});
```

Bewährt hat sich eine eigene Provider-Komponente plus ein kleiner Hook (`useTasks()`), der den Context liest. So muss niemand wissen, wie der Context intern aufgebaut ist.

> [!WARNING]
> Context ist kein Ersatz für jede Prop. Reiche Daten zuerst ganz normal weiter oder nutze `children`, damit Zwischenebenen gar nichts weiterreichen müssen. Context lohnt sich für Werte, die wirklich viele Komponenten an vielen Stellen brauchen.

::tryit{context}
