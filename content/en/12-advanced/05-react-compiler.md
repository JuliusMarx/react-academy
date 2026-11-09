---
title: The React Compiler
minutes: 6
summary: |-
  - The React Compiler analyzes your components at build time and inserts memoization automatically – like `memo`, `useMemo` and `useCallback`, but without changing your code.
  - Setup with Vite 7 and `@vitejs/plugin-react` 5 (as in this course): install `babel-plugin-react-compiler` and add it under `babel.plugins`. From `@vitejs/plugin-react` 6 (Vite 8) on, the `babel` option no longer exists – there you use `@rolldown/plugin-babel` with `reactCompilerPreset()`.
  - It detects which values depend on which props and state, and reuses JSX, computed values and functions as long as none of those change – even arrow functions in JSX.
  - It relies on the Rules of React: pure components, never mutate props or state, hooks at the top level. Otherwise it skips the component; `eslint-plugin-react-hooks` flags such spots.
  - You rarely need `memo` and friends anymore – only in existing code or for precise control, e.g. stable effect dependencies.

  ```ts
  // vite.config.ts
  export default defineConfig({
    plugins: [
      react({
        babel: { plugins: ['babel-plugin-react-compiler'] },
      }),
    ],
  });
  ```

  > [!TIP] React DevTools marks components the compiler has optimized with a **Memo ✨** badge.
quiz:
  - question: "What does the React Compiler do?"
    options: ["It translates React into another language", "It automatically adds memoization at build time – similar to `memo`, `useMemo`, and `useCallback`", "It replaces Vite", "It checks TypeScript types"]
    answer: 1
  - question: "Which code benefits from the React Compiler?"
    options: ["Any code, even code that mutates state","Only class components","Code that follows the rules of React: pure components, no mutating props and state, hooks at the top level","Only code without hooks"]
    answer: 2
---

# The React Compiler

In Chapter 5 you saw how `memo`, `useMemo`, and `useCallback` prevent unnecessary rendering – and how easy it is to forget them or use them wrongly. The **React Compiler** takes that off your hands: it analyzes your components at build time and inserts memoization automatically.

## Setting it up with Vite

```bash
npm install -D babel-plugin-react-compiler
```

```ts
// vite.config.ts
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: { plugins: ['babel-plugin-react-compiler'] },
    }),
  ],
});
```

That's all. Your code stays unchanged – no `memo`, no `useMemo`, no `useCallback`.

> [!NOTE]
> This configuration applies to Vite 7 with `@vitejs/plugin-react` 5, as in this course's examples. A new project created with `npm create vite@latest` gets Vite 8 and `@vitejs/plugin-react` 6, which removed the `babel` option. Instead, install `@rolldown/plugin-babel`, `@babel/core` and `babel-plugin-react-compiler` and write:
>
> ```ts
> import babel from '@rolldown/plugin-babel';
> import react, { reactCompilerPreset } from '@vitejs/plugin-react';
>
> export default defineConfig({
>   plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
> });
> ```

## What it does

The compiler works out which values depend on which props and which state. If none of those change, it reuses the previous result: JSX, computed values, functions. In the example below, `ProductList` therefore doesn't re-render when you type a note – even though `onPick` is an arrow function in the JSX.

## Prerequisite: the rules of React

The compiler can only optimize like this because it relies on the rules of React:

- Components and hooks are **pure** – same inputs, same result.
- Props and state are **never mutated**, only replaced.
- Hooks are called **at the top level**, not inside conditions.

If a component doesn't follow them, the compiler simply skips it. The ESLint rules from `eslint-plugin-react-hooks` point out such spots.

## Do I still need memo?

Hardly, with the compiler. `memo`, `useMemo`, and `useCallback` are still important, though: they appear in a great deal of existing code, and sometimes you need precise control, for example when a value has to stay stable as an effect dependency.

> [!TIP]
> React DevTools marks components the compiler has optimized with a small **Memo ✨** badge.

::tryit{react-compiler}
