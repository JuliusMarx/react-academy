import { Lang } from './content.model';

export interface GlossaryEntry {
  /** Anchor on the glossary page. */
  id: string;
  /** The term – one string if it is the same in both languages. */
  term: string | Record<Lang, string>;
  /** Short explanation per language. Text in `backticks` is shown as code. */
  text: Record<Lang, string>;
  /** Lesson ids ("chapter/lesson") that explain the term in depth. */
  lessons: string[];
}

/** Key terms of the course. Keep it sorted loosely by topic – the page sorts alphabetically. */
export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'component',
    term: { de: 'Komponente', en: 'Component' },
    text: {
      de: 'Funktion, die JSX zurückgibt und so ein Stück Oberfläche beschreibt. Ihr Name beginnt mit einem Großbuchstaben.',
      en: 'A function that returns JSX and so describes a piece of UI. Its name starts with a capital letter.',
    },
    lessons: ['introduction/first-component'],
  },
  {
    id: 'vite',
    term: 'Vite',
    text: {
      de: 'Build-Werkzeug und Entwicklungsserver, mit dem du React-Projekte anlegst und startest (`npm create vite@latest`).',
      en: 'Build tool and dev server you use to create and run React projects (`npm create vite@latest`).',
    },
    lessons: ['introduction/vite-project'],
  },
  {
    id: 'jsx',
    term: 'JSX',
    text: {
      de: 'HTML-ähnliche Syntax in JavaScript; `{ausdruck}` bettet Werte ein. Wird zu Funktionsaufrufen übersetzt.',
      en: 'HTML-like syntax inside JavaScript; `{expression}` embeds values. It compiles to function calls.',
    },
    lessons: ['jsx-and-components/jsx'],
  },
  {
    id: 'props',
    term: 'Props',
    text: {
      de: 'Eingaben einer Komponente, die die Elternkomponente als Attribute übergibt. Sie sind schreibgeschützt.',
      en: 'Inputs of a component that the parent passes as attributes. They are read-only.',
    },
    lessons: ['jsx-and-components/props'],
  },
  {
    id: 'children',
    term: 'children',
    text: {
      de: 'Besonderes Prop mit dem Inhalt zwischen den Tags einer Komponente.',
      en: 'Special prop holding the content between a component’s tags.',
    },
    lessons: ['jsx-and-components/props'],
  },
  {
    id: 'key',
    term: 'key',
    text: {
      de: 'Eindeutige Kennung für Listeneinträge, damit React sie beim erneuten Rendern wiedererkennt.',
      en: 'Unique identifier for list items, so React recognizes them between renders.',
    },
    lessons: ['jsx-and-components/lists-and-keys'],
  },
  {
    id: 'event-handler',
    term: 'Event-Handler',
    text: {
      de: 'Funktion, die du an `onClick`, `onChange` usw. übergibst – nicht aufrufst: `onClick={speichern}`.',
      en: 'Function you pass to `onClick`, `onChange` etc. – without calling it: `onClick={save}`.',
    },
    lessons: ['jsx-and-components/events'],
  },
  {
    id: 'state',
    term: 'State',
    text: {
      de: 'Daten, die sich ändern und die Oberfläche neu rendern lassen; mit `useState` oder `useReducer` angelegt.',
      en: 'Data that changes and makes the UI re-render; created with `useState` or `useReducer`.',
    },
    lessons: ['state/use-state', 'state-management/which-state-where'],
  },
  {
    id: 'use-state',
    term: 'useState',
    text: {
      de: 'Hook für lokalen State: liefert den Wert und eine Setter-Funktion, z. B. `const [count, setCount] = useState(0)`.',
      en: 'Hook for local state: returns the value and a setter, e.g. `const [count, setCount] = useState(0)`.',
    },
    lessons: ['state/use-state', 'state/objects-and-arrays'],
  },
  {
    id: 'immutability',
    term: { de: 'Unveränderlichkeit (Immutability)', en: 'Immutability' },
    text: {
      de: 'State nie direkt ändern, sondern durch eine neue Kopie ersetzen, z. B. `[...liste, neu]` – sonst rendert React nicht neu.',
      en: 'Never change state in place but replace it with a new copy, e.g. `[...list, item]` – otherwise React does not re-render.',
    },
    lessons: ['state/objects-and-arrays'],
  },
  {
    id: 'controlled-input',
    term: { de: 'Kontrolliertes Eingabefeld', en: 'Controlled input' },
    text: {
      de: 'Formularfeld, dessen Wert aus dem State kommt (`value`) und über `onChange` zurückgeschrieben wird.',
      en: 'Form field whose value comes from state (`value`) and is written back through `onChange`.',
    },
    lessons: ['state/controlled-inputs'],
  },
  {
    id: 'lifting-state',
    term: { de: 'State anheben (Lifting State Up)', en: 'Lifting state up' },
    text: {
      de: 'State in die nächste gemeinsame Elternkomponente verschieben, damit mehrere Kinder ihn teilen.',
      en: 'Moving state to the closest common parent so several children can share it.',
    },
    lessons: ['state/lifting-state-up'],
  },
  {
    id: 'hook',
    term: 'Hook',
    text: {
      de: 'Funktion, deren Name mit `use` beginnt und die React-Funktionen wie State nutzt. Nur oben in Komponenten oder Hooks aufrufen.',
      en: 'Function whose name starts with `use` and that uses React features such as state. Call it only at the top of components or hooks.',
    },
    lessons: ['state/use-state', 'hooks-in-depth/custom-hooks'],
  },
  {
    id: 'use-effect',
    term: 'useEffect',
    text: {
      de: 'Synchronisiert eine Komponente mit etwas außerhalb von React, z. B. Timern, Abos oder dem DOM.',
      en: 'Synchronizes a component with something outside React, such as timers, subscriptions or the DOM.',
    },
    lessons: ['effects-and-refs/use-effect', 'effects-and-refs/you-might-not-need-an-effect'],
  },
  {
    id: 'cleanup',
    term: { de: 'Cleanup-Funktion', en: 'Cleanup function' },
    text: {
      de: 'Funktion, die ein Effekt zurückgibt; React ruft sie vor dem nächsten Effekt und beim Entfernen der Komponente auf.',
      en: 'Function an effect returns; React calls it before the next effect run and when the component is removed.',
    },
    lessons: ['effects-and-refs/cleanup'],
  },
  {
    id: 'dependency-array',
    term: { de: 'Abhängigkeits-Array', en: 'Dependency array' },
    text: {
      de: 'Zweites Argument von `useEffect`, `useMemo` und `useCallback`: Werte, bei deren Änderung neu ausgeführt wird.',
      en: 'Second argument of `useEffect`, `useMemo` and `useCallback`: values whose change triggers a re-run.',
    },
    lessons: ['effects-and-refs/use-effect', 'hooks-in-depth/memoization'],
  },
  {
    id: 'use-ref',
    term: 'useRef',
    text: {
      de: 'Hält einen Wert über Renderings hinweg, ohne neu zu rendern – oft für einen Verweis auf ein DOM-Element.',
      en: 'Keeps a value across renders without re-rendering – often a reference to a DOM element.',
    },
    lessons: ['effects-and-refs/use-ref'],
  },
  {
    id: 'use-reducer',
    term: 'useReducer',
    text: {
      de: 'State mit einer Reducer-Funktion `(state, action) => neuerState` verwalten – praktisch bei vielen Übergängen.',
      en: 'Managing state with a reducer `(state, action) => newState` – handy when there are many transitions.',
    },
    lessons: ['hooks-in-depth/use-reducer', 'state-management/context-and-reducer'],
  },
  {
    id: 'context',
    term: 'Context',
    text: {
      de: 'Gibt Werte an alle Komponenten darunter weiter, ohne Props durch jede Ebene zu reichen.',
      en: 'Passes values to every component below it without threading props through each level.',
    },
    lessons: ['hooks-in-depth/context', 'state-management/context-and-reducer'],
  },
  {
    id: 'custom-hook',
    term: { de: 'Eigener Hook', en: 'Custom hook' },
    text: {
      de: 'Eigene `use…`-Funktion, die Logik mit Hooks bündelt und in mehreren Komponenten wiederverwendet wird.',
      en: 'Your own `use…` function that bundles logic built from hooks for reuse across components.',
    },
    lessons: ['hooks-in-depth/custom-hooks'],
  },
  {
    id: 'memoization',
    term: { de: 'Memoisierung', en: 'Memoization' },
    text: {
      de: 'Ergebnisse merken, um Arbeit zu sparen: `memo` für Komponenten, `useMemo` für Werte, `useCallback` für Funktionen.',
      en: 'Remembering results to save work: `memo` for components, `useMemo` for values, `useCallback` for functions.',
    },
    lessons: ['hooks-in-depth/memoization', 'advanced/react-compiler'],
  },
  {
    id: 'suspense',
    term: 'Suspense',
    text: {
      de: 'Zeigt einen Platzhalter (`fallback`), solange Kinder noch auf Daten oder Code warten.',
      en: 'Shows a placeholder (`fallback`) while its children are still waiting for data or code.',
    },
    lessons: ['data-fetching/suspense-and-use', 'advanced/code-splitting'],
  },
  {
    id: 'use',
    term: 'use()',
    text: {
      de: 'Liest den Wert eines Promise oder Context; bei einem offenen Promise übernimmt die nächste Suspense-Grenze.',
      en: 'Reads the value of a promise or context; while a promise is pending, the nearest Suspense boundary takes over.',
    },
    lessons: ['data-fetching/suspense-and-use'],
  },
  {
    id: 'error-boundary',
    term: 'Error Boundary',
    text: {
      de: 'Komponente, die Fehler beim Rendern ihrer Kinder abfängt und stattdessen eine Ersatzanzeige zeigt.',
      en: 'Component that catches errors while rendering its children and shows a fallback instead.',
    },
    lessons: ['data-fetching/error-boundaries'],
  },
  {
    id: 'tanstack-query',
    term: 'TanStack Query',
    text: {
      de: 'Bibliothek für Server-Daten mit Caching, erneutem Laden und Ladezuständen, z. B. über `useQuery`.',
      en: 'Library for server data with caching, refetching and loading states, e.g. through `useQuery`.',
    },
    lessons: ['data-fetching/tanstack-query'],
  },
  {
    id: 'route',
    term: 'Route',
    text: {
      de: 'Zuordnung eines URL-Pfads zu einer Komponente in React Router; `<Link>` navigiert, `<Outlet>` zeigt Kind-Routen.',
      en: 'Maps a URL path to a component in React Router; `<Link>` navigates, `<Outlet>` renders child routes.',
    },
    lessons: ['routing/routes-and-links', 'routing/nested-routes'],
  },
  {
    id: 'loader',
    term: 'Loader',
    text: {
      de: 'Funktion einer Route, die Daten lädt, bevor die Seite gerendert wird; gelesen mit `useLoaderData`.',
      en: 'Route function that loads data before the page renders; read with `useLoaderData`.',
    },
    lessons: ['routing/loaders'],
  },
  {
    id: 'form-action',
    term: 'Form Action',
    text: {
      de: 'Funktion im `action`-Attribut eines `<form>`; React ruft sie mit den `FormData` auf und verwaltet den Ladezustand.',
      en: 'Function in a `<form>`’s `action` attribute; React calls it with the `FormData` and tracks its pending state.',
    },
    lessons: ['forms-and-actions/form-actions', 'forms-and-actions/use-action-state'],
  },
  {
    id: 'use-optimistic',
    term: 'useOptimistic',
    text: {
      de: 'Zeigt das erwartete Ergebnis einer Aktion sofort an, bevor der Server antwortet.',
      en: 'Shows the expected result of an action right away, before the server has answered.',
    },
    lessons: ['forms-and-actions/use-optimistic'],
  },
  {
    id: 'css-modules',
    term: 'CSS Modules',
    text: {
      de: 'CSS-Dateien (`*.module.css`), deren Klassennamen nur in der importierenden Komponente gelten.',
      en: 'CSS files (`*.module.css`) whose class names apply only to the component that imports them.',
    },
    lessons: ['styling/css-modules'],
  },
  {
    id: 'tailwind',
    term: 'Tailwind CSS',
    text: {
      de: 'CSS-Framework mit kleinen Hilfsklassen wie `p-4` oder `text-lg`, die du direkt in `className` kombinierst.',
      en: 'CSS framework with small utility classes such as `p-4` or `text-lg` that you combine right in `className`.',
    },
    lessons: ['styling/tailwind'],
  },
  {
    id: 'global-store',
    term: { de: 'Globaler Store', en: 'Global store' },
    text: {
      de: 'Zentraler State außerhalb der Komponenten, z. B. mit Zustand oder Redux Toolkit, den beliebige Komponenten lesen.',
      en: 'Central state outside components, e.g. with Zustand or Redux Toolkit, that any component can read.',
    },
    lessons: ['state-management/zustand', 'state-management/redux-toolkit'],
  },
  {
    id: 'testing-library',
    term: 'Testing Library',
    text: {
      de: 'Testet Komponenten so, wie Nutzer sie sehen – Elemente findest du über Rolle und Text, z. B. `getByRole`.',
      en: 'Tests components the way users see them – you find elements by role and text, e.g. `getByRole`.',
    },
    lessons: ['testing/vitest-and-testing-library', 'testing/user-interactions'],
  },
  {
    id: 'mock',
    term: 'Mock',
    text: {
      de: 'Ersatz für eine echte Abhängigkeit im Test, etwa `vi.fn()` oder ein vorgetäuschter `fetch`.',
      en: 'Stand-in for a real dependency in a test, such as `vi.fn()` or a faked `fetch`.',
    },
    lessons: ['testing/mocking'],
  },
  {
    id: 'e2e',
    term: { de: 'UI-Test (End-to-End)', en: 'UI test (end-to-end)' },
    text: {
      de: 'Test, der die fertige App im Browser bedient wie ein Mensch – im Kurs mit Playwright.',
      en: 'Test that drives the finished app in a browser like a person would – with Playwright in this course.',
    },
    lessons: ['testing/playwright'],
  },
  {
    id: 'lazy',
    term: 'lazy()',
    text: {
      de: 'Lädt den Code einer Komponente erst, wenn sie zum ersten Mal gerendert wird (Code-Splitting).',
      en: 'Loads a component’s code only when it is rendered for the first time (code splitting).',
    },
    lessons: ['advanced/code-splitting'],
  },
  {
    id: 'transition',
    term: 'Transition',
    text: {
      de: 'Markiert ein Update mit `startTransition` oder `useTransition` als nicht dringend, damit Eingaben flüssig bleiben.',
      en: 'Marks an update as non-urgent with `startTransition` or `useTransition`, so input stays responsive.',
    },
    lessons: ['advanced/transitions'],
  },
  {
    id: 'portal',
    term: { de: 'Portal', en: 'Portal' },
    text: {
      de: 'Rendert Kinder mit `createPortal` an einer anderen Stelle im DOM, etwa für Dialoge oder Tooltips.',
      en: 'Renders children elsewhere in the DOM with `createPortal`, e.g. for dialogs or tooltips.',
    },
    lessons: ['advanced/portals'],
  },
  {
    id: 'react-compiler',
    term: 'React Compiler',
    text: {
      de: 'Build-Werkzeug, das Komponenten automatisch memoisiert, sodass `useMemo` und `useCallback` meist entfallen.',
      en: 'Build tool that memoizes components automatically, so `useMemo` and `useCallback` are mostly unnecessary.',
    },
    lessons: ['advanced/react-compiler'],
  },
  {
    id: 'server-components',
    term: 'Server Components',
    text: {
      de: 'Komponenten, die nur auf dem Server laufen und kein JavaScript zum Browser schicken – nutzbar mit Frameworks wie Next.js.',
      en: 'Components that run only on the server and send no JavaScript to the browser – used with frameworks such as Next.js.',
    },
    lessons: ['advanced/server-components'],
  },
  {
    id: 'aria',
    term: 'ARIA',
    text: {
      de: 'Attribute wie `aria-label` oder `aria-expanded`, die Hilfstechnologien Rolle und Zustand eines Elements mitteilen.',
      en: 'Attributes such as `aria-label` or `aria-expanded` that tell assistive technology an element’s role and state.',
    },
    lessons: ['accessibility/aria-and-ids'],
  },
  {
    id: 'use-id',
    term: 'useId',
    text: {
      de: 'Erzeugt eindeutige IDs, um z. B. ein `<label>` per `htmlFor` mit seinem Feld zu verbinden.',
      en: 'Generates unique IDs, e.g. to connect a `<label>` to its field through `htmlFor`.',
    },
    lessons: ['accessibility/aria-and-ids'],
  },
  {
    id: 'live-region',
    term: { de: 'Live-Region', en: 'Live region' },
    text: {
      de: 'Bereich mit `aria-live` oder `role="status"`, dessen Änderungen Screenreader von selbst vorlesen.',
      en: 'Area with `aria-live` or `role="status"` whose changes screen readers announce on their own.',
    },
    lessons: ['accessibility/announcements-and-testing'],
  },
];
