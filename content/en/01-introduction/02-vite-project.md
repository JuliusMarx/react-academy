---
title: A Project with Vite
minutes: 6
summary: |-
  - **Vite** is a fast build tool with a dev server and the usual way to start a React project without a framework. *Create React App* is no longer maintained.
  - The dev server runs on `http://localhost:5173`; `npm run build` creates the optimized version in `dist/`.
  - `index.html` is the only HTML page and contains `<div id="root">`. `src/main.tsx` is the entry point.
  - `createRoot` connects React to the DOM element, and `render` shows `<App />` inside it.
  - `StrictMode` helps you find bugs and calls components twice during development as a check – not in the production build.
  - Files with JSX end in `.tsx`, plain TypeScript files in `.ts`. Components and their files use PascalCase: `ProductCard.tsx`.

  ```bash
  npm create vite@latest my-app -- --template react-ts
  cd my-app
  npm install
  npm run dev
  ```
quiz:
  - question: "Which command do you use to create a new React project with Vite?"
    options: ["`npx create-react-app my-app`","`ng new my-app --react`","`npm install react my-app`","`npm create vite@latest my-app -- --template react-ts`"]
    answer: 3
    explanation: "Create React App is deprecated. For new projects without a framework, Vite is the standard."
  - question: "Which file renders the App component into the page?"
    options: ["`src/main.tsx`","`vite.config.ts`","`index.html`","`package.json`"]
    answer: 0
    explanation: "`main.tsx` uses `createRoot` to get the `#root` element from `index.html` and renders `<App />` there."
---

# A Project with Vite

**Vite** is a fast build tool with a dev server. Today it is the usual way to start a React project without a framework. (*Create React App*, which used to be common, is no longer maintained.)

## Creating a project

You need [Node.js](https://nodejs.org) (current LTS version). Then:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

The dev server then runs at `http://localhost:5173`. With `npm run build`, you create the finished, optimized version in the `dist/` folder.

## The most important files

```
my-app/
  index.html          # The only HTML page, contains <div id="root">
  vite.config.ts      # Vite configuration with the React plugin
  package.json        # Dependencies and scripts (dev, build, preview)
  tsconfig.json       # TypeScript settings
  src/
    main.tsx          # Entry point: renders <App /> into #root
    App.tsx           # Your first component
```

The entry point `main.tsx` is short:

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

- `createRoot` connects React to a DOM element.
- `render` displays the `App` component inside it.
- `StrictMode` helps you find bugs during development. Among other things, it calls components twice on purpose. This doesn't happen in the production build.

## .tsx and .ts

Files containing JSX end in **`.tsx`**, plain TypeScript files (helper functions, types) end in **`.ts`**. Write component names and their files in **PascalCase**: `ProductCard.tsx`.

::tryit{project-structure}

> [!NOTE]
> All live examples in this course are exactly such Vite projects. Feel free to look at `index.html` and `main.tsx` in the editor.
