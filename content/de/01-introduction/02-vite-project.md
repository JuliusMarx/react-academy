---
title: Ein Projekt mit Vite
minutes: 6
quiz:
  - question: "Mit welchem Befehl legst du ein neues React-Projekt mit Vite an?"
    options: ["`npx create-react-app my-app`", "`npm create vite@latest my-app -- --template react-ts`", "`npm install react my-app`", "`ng new my-app --react`"]
    answer: 1
    explanation: "Create React App ist veraltet. Für neue Projekte ohne Framework ist Vite der Standard."
  - question: "Welche Datei rendert die App-Komponente in die Seite?"
    options: ["`index.html`", "`vite.config.ts`", "`src/main.tsx`", "`package.json`"]
    answer: 2
    explanation: "`main.tsx` holt sich mit `createRoot` das Element `#root` aus der `index.html` und rendert dort `<App />`."
---

# Ein Projekt mit Vite

**Vite** ist ein schnelles Build-Tool mit Dev-Server. Es ist heute der übliche Weg, ein React-Projekt ohne Framework zu starten. (Das früher verbreitete *Create React App* wird nicht mehr weiterentwickelt.)

## Projekt anlegen

Du brauchst [Node.js](https://nodejs.org) (aktuelle LTS-Version). Dann:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

Der Dev-Server läuft danach auf `http://localhost:5173`. Mit `npm run build` erzeugst du die fertige, optimierte Version im Ordner `dist/`.

## Die wichtigsten Dateien

```
my-app/
  index.html          # Die einzige HTML-Seite, enthält <div id="root">
  vite.config.ts      # Vite-Konfiguration mit dem React-Plugin
  package.json        # Abhängigkeiten und Skripte (dev, build, preview)
  tsconfig.json       # TypeScript-Einstellungen
  src/
    main.tsx          # Einstiegspunkt: rendert <App /> in #root
    App.tsx           # Deine erste Komponente
```

Der Einstiegspunkt `main.tsx` ist kurz:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- `createRoot` verbindet React mit einem DOM-Element.
- `render` zeigt darin die Komponente `App` an.
- `StrictMode` hilft beim Entwickeln Fehler zu finden. Unter anderem ruft er Komponenten testweise doppelt auf – im fertigen Build passiert das nicht.

## .tsx und .ts

Dateien mit JSX enden auf **`.tsx`**, reine TypeScript-Dateien (Hilfsfunktionen, Typen) auf **`.ts`**. Komponentennamen und ihre Dateien schreibst du in **PascalCase**: `ProductCard.tsx`.

::tryit{project-structure}

> [!NOTE]
> Alle Live-Beispiele in diesem Kurs sind genau solche Vite-Projekte. Schau dir im Editor ruhig `index.html` und `main.tsx` an.
