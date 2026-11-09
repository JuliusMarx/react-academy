---
title: Der React Compiler
minutes: 6
summary: |-
  - Der React Compiler analysiert deine Komponenten beim Build und fügt Memoisierung automatisch ein – wie `memo`, `useMemo` und `useCallback`, aber ohne Änderung am Code.
  - Einrichten mit Vite 7 und `@vitejs/plugin-react` 5 (wie in diesem Kurs): `babel-plugin-react-compiler` installieren und unter `babel.plugins` eintragen. Ab `@vitejs/plugin-react` 6 (Vite 8) gibt es die Option `babel` nicht mehr – dort nimmst du `@rolldown/plugin-babel` mit `reactCompilerPreset()`.
  - Er erkennt, welche Werte von welchen Props und welchem State abhängen, und verwendet JSX, berechnete Werte und Funktionen wieder, solange sich nichts davon ändert – auch Pfeilfunktionen im JSX.
  - Voraussetzung sind die Regeln von React: reine Komponenten, Props und State nie verändern, Hooks auf oberster Ebene. Sonst überspringt er die Komponente; `eslint-plugin-react-hooks` zeigt solche Stellen an.
  - `memo` & Co. brauchst du kaum noch – nur in bestehendem Code oder für genaue Kontrolle, etwa stabile Effekt-Abhängigkeiten.

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

  > [!TIP] Die React DevTools markieren vom Compiler optimierte Komponenten mit einem **Memo ✨**-Abzeichen.
quiz:
  - question: "Was macht der React Compiler?"
    options: ["Er übersetzt React in eine andere Sprache", "Er fügt beim Build automatisch Memoisierung ein – ähnlich wie `memo`, `useMemo` und `useCallback`", "Er ersetzt Vite", "Er prüft TypeScript-Typen"]
    answer: 1
  - question: "Welcher Code profitiert vom React Compiler?"
    options: ["Jeder Code, auch solcher, der State verändert","Nur Klassenkomponenten","Code, der die Regeln von React einhält: reine Komponenten, kein Verändern von Props und State, Hooks auf oberster Ebene","Nur Code ohne Hooks"]
    answer: 2
---

# Der React Compiler

In Kapitel 5 hast du gesehen, wie `memo`, `useMemo` und `useCallback` unnötiges Rendern verhindern – und wie leicht man sie vergisst oder falsch einsetzt. Der **React Compiler** nimmt dir das ab: Er analysiert deine Komponenten beim Build und fügt die Memoisierung automatisch ein.

## Einrichten mit Vite

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

Das ist alles. Dein Code bleibt unverändert – kein `memo`, kein `useMemo`, kein `useCallback`.

> [!NOTE]
> Diese Konfiguration gilt für Vite 7 mit `@vitejs/plugin-react` 5, wie in den Beispielen dieses Kurses. Ein neues Projekt mit `npm create vite@latest` bekommt Vite 8 und `@vitejs/plugin-react` 6 – dort wurde die Option `babel` entfernt. Stattdessen installierst du `@rolldown/plugin-babel`, `@babel/core` und `babel-plugin-react-compiler` und schreibst:
>
> ```ts
> import babel from '@rolldown/plugin-babel';
> import react, { reactCompilerPreset } from '@vitejs/plugin-react';
>
> export default defineConfig({
>   plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
> });
> ```

## Was er tut

Der Compiler erkennt, welche Werte von welchen Props und welchem State abhängen. Ändert sich nichts davon, verwendet er das vorherige Ergebnis: JSX, berechnete Werte, Funktionen. Im Beispiel unten rendert `ProductList` deshalb nicht neu, wenn du eine Notiz tippst – obwohl `onPick` eine Pfeilfunktion im JSX ist.

## Voraussetzung: die Regeln von React

Der Compiler darf nur so optimieren, weil er sich auf die Regeln von React verlässt:

- Komponenten und Hooks sind **rein** – gleiche Eingaben, gleiches Ergebnis.
- Props und State werden **nie verändert**, sondern ersetzt.
- Hooks stehen **auf oberster Ebene**, nicht in Bedingungen.

Hält sich eine Komponente nicht daran, überspringt der Compiler sie einfach. Die ESLint-Regeln aus `eslint-plugin-react-hooks` zeigen solche Stellen an.

## Brauche ich memo noch?

Mit Compiler kaum noch. `memo`, `useMemo` und `useCallback` bleiben trotzdem wichtig: Sie stehen in sehr viel bestehendem Code, und manchmal brauchst du genaue Kontrolle, etwa wenn ein Wert als Abhängigkeit eines Effekts stabil bleiben muss.

> [!TIP]
> Die React DevTools markieren Komponenten, die der Compiler optimiert hat, mit einem kleinen **Memo ✨**-Abzeichen.

::tryit{react-compiler}
