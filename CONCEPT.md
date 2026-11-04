# React Academy – Konzept

## 1. Vision

Eine interaktive Lernplattform für React im Stil von W3Schools: kurze, gut strukturierte Lektionen, zu jedem Thema ein **„Try it yourself“** mit echtem React im Browser und kleine Übungen mit direktem Feedback. Schwesterprojekt der Angular Academy – gleiche Plattform, gleiches Bedienkonzept.

## 2. Eckpunkte

| Thema | Entscheidung |
|---|---|
| Zielgruppe | Entwickler mit JavaScript-/TypeScript-Grundlagen, Fokus komplett auf React |
| React-Stil | Aktuelles React (19.x): nur Funktionskomponenten und Hooks, TypeScript, Vite |
| Live-Editor | Echtes Vite-+-React-Projekt im Browser über StackBlitz WebContainers (`@stackblitz/sdk`) |
| Plattform | Fork der Angular Academy (Angular-App mit Prerendering) – Lernende sehen davon nichts |
| Fortschritt | Nur im Browser (`localStorage`), kein Backend, kein Login |
| Sprache | Deutsch und Englisch von Anfang an |
| Hosting | Statische Seite (z. B. Netlify), noch nicht eingerichtet |

## 3. Nutzererlebnis

### Seitenaufbau (pro Lektion)
```
┌──────────────┬────────────────────────────────────────┐
│ Navigation   │  Lektion: "useState"                   │
│              │  Erklärtext, Codebeispiele             │
│ ▸ Einführung │                                        │
│ ▾ State ✓    │  ┌──────────────────────────────────┐  │
│   • useState │  │ [ Ausprobieren ▶ ]               │  │
│   • Objekte  │  └──────────────────────────────────┘  │
│ ▸ Effekte    │                                        │
│              │  Übung · Quiz (2–3 Fragen)             │
│ Fortschritt  │                                        │
│ ███████░ 70% │  ◀ Zurück                  Weiter ▶   │
└──────────────┴────────────────────────────────────────┘
```

### Kernfunktionen
1. **Lektionen**: Markdown-Inhalte mit Syntax-Highlighting (TSX), Hinweisboxen und Copy-Button.
2. **Try it yourself**: Öffnet das passende Beispielprojekt eingebettet in StackBlitz (Editor + Vorschau). Jedes Beispiel ist ein kleines Vite-+-React-Projekt.
3. **Quiz**: Multiple Choice am Ende jeder Lektion, wird sofort ausgewertet.
4. **Übungen**: Startcode mit Aufgabe. Ein Prüf-Kit lädt die Vorschau nach jedem Speichern neu, prüft das Verhalten der App und meldet das Ergebnis per `postMessage` an die Kursseite (Checkliste, „Gelöst“, Lösung anzeigen).
5. **Fortschritt**, **Suche** (Strg+K), **DE/EN**, **Dark Mode** – wie in der Angular Academy.

## 4. Lehrplan

1. **Einführung**: Was ist React, Projekt mit Vite, erste Komponente ✅
2. **JSX & Komponenten**: JSX-Regeln, Props, bedingtes Rendern, Listen & `key`, Events ✅
3. **State**: `useState`, Objekte & Arrays im State, State nach oben verlagern, kontrollierte Formularfelder ✅
4. **Effekte & Refs**: `useEffect`, Cleanup, `useRef`, „You Might Not Need an Effect“ ✅
5. **Hooks vertieft**: `useReducer`, Context, eigene Hooks, `useMemo`/`useCallback`/`memo`
6. **Daten laden**: `fetch` im Effekt, `use()` + Suspense, Error Boundaries, TanStack Query
7. **Routing**: React Router (Routen, Parameter, verschachtelte Layouts, Loader)
8. **Formulare & Actions**: `<form action>`, `useActionState`, `useFormStatus`, `useOptimistic`
9. **Styling**: CSS Modules, Tailwind CSS, Klassen bedingt setzen
10. **State Management**: Wann globaler State? Context vs. Zustand vs. Redux Toolkit
11. **Testing**: Vitest + React Testing Library, UI-Tests mit Playwright
12. **Fortgeschritten**: React Compiler, Performance, Portale, Server Components & Frameworks (Next.js), TypeScript-Muster

Jede Lektion: ca. 5–10 Minuten Lesezeit, mindestens 1 Live-Beispiel, 2–3 Quizfragen, wo sinnvoll eine Übung.

## 5. Technische Architektur

Siehe [README.md](README.md). Kurz:

- Plattform: Angular-App (Fork der Angular Academy) mit Prerendering; Inhalte als Markdown in `content/`, Beispiele als Projektdateien in `examples/`, `scripts/build-content.mjs` erzeugt daraus TypeScript-Module.
- Beispiele: `examples/_base` ist ein Vite-+-React-19-Projekt mit TypeScript. Es bleibt bei **Vite 7**, weil Vite 8 auf rolldown setzt – die gleiche Toolchain, an der Angular 22 in StackBlitz-WebContainern scheiterte. Vor einem Upgrade in StackBlitz testen.
- Übungen: `examples/_exercise-kit` ersetzt `main.tsx` (App starten, dann Prüfungen ausführen) und `vite.config.ts` (bei jedem Speichern komplett neu laden).

## 6. Roadmap

### Phase 1 – MVP (dieser Stand)
- Plattform aus der Angular Academy übernommen, Branding, Beispiel-Basis und Prüf-Kit auf React umgestellt
- **Kapitel 1–3** auf DE und EN, mit Live-Beispielen, Quizzen und Übungen

### Phase 2
- Kapitel 4–8
- Hosting einrichten (Netlify-Credits sparsam einsetzen)

### Phase 3
- Kapitel 9–12, inklusive Test-Kit (Vitest + Testing Library in der Vorschau)

## 7. Offene Fragen
- Hosting und Domain
- Eigenes Repo auf GitHub anlegen (privat wie die Angular Academy?)
