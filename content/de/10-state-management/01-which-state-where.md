---
title: Welcher State wohin?
minutes: 6
summary: |-
  - Frag zuerst, welche Art von State es ist. Die meisten Probleme mit „globalem State“ verschwinden, wenn jeder State am richtigen Ort liegt.
  - So lokal wie möglich: `useState` oder `useReducer` in der tiefsten Komponente, die ihn braucht. Teilen zwei Geschwister ihn, wandert er in die nächste gemeinsame Elternkomponente.
  - Serverdaten sind kein Client-State: TanStack Query, Router-Loader oder Server Components übernehmen Caching und Aktualisieren.
  - Filter, Sortierung oder Seite gehören in die URL (`useSearchParams`) – dann funktionieren Neuladen, Teilen und der Zurück-Button.
  - Abgeleitetes wie Summen oder gefilterte Listen speicherst du nicht, sondern berechnest es beim Rendern.
  - Für App-weiten Client-State reicht Context bei seltenen Änderungen – er rendert aber alle Leser neu. Zustand und Redux Toolkit abonnieren per Selektor nur den Teil, den eine Komponente braucht.

  > [!TIP] Echtes State Management brauchst du nur für App-weiten Client-State wie Warenkorb oder Farbschema – und der ist oft kleiner als gedacht.
quiz:
  - question: "Wo gehören Daten vom Server hin, z. B. eine Produktliste?"
    options: ["In einen globalen Store wie Redux","In `localStorage`","In eine Bibliothek für Serverdaten wie TanStack Query oder in die Loader des Routers","In eine globale Variable"]
    answer: 2
    explanation: "Serverdaten brauchen Caching, erneutes Laden und Fehlerbehandlung – das bringen diese Werkzeuge mit. Ein globaler Store müsste das alles nachbauen."
  - question: "Ein Filter soll erhalten bleiben, wenn man den Link teilt. Wo speicherst du ihn?"
    options: ["In `useState`","In einem Ref","In Context","In der URL, z. B. mit `useSearchParams`"]
    answer: 3
---

# Welcher State wohin?

Bevor du zu einer State-Management-Bibliothek greifst, lohnt sich die Frage: Welche Art von State ist das eigentlich? Die meisten Probleme mit „globalem State“ verschwinden, wenn jeder State am richtigen Ort liegt.

## Arten von State

| Art | Beispiele | Wohin? |
|---|---|---|
| Lokaler UI-State | offen/zu, Eingabe, aktiver Tab | `useState` / `useReducer` in der Komponente |
| Geteilter UI-State | Auswahl, die zwei Geschwister brauchen | in die nächste gemeinsame Elternkomponente |
| URL-State | Filter, Sortierung, Seite, ausgewählte ID | Route-Parameter und `useSearchParams` |
| Serverdaten | Produkte, Nutzer, Bestellungen | TanStack Query, Router-Loader, Server Components |
| Formular-State | Eingaben, Fehler, Absenden | Form Actions, `useActionState`, ggf. React Hook Form |
| App-weiter Client-State | Warenkorb, Farbschema, Login-Status, Editor-Zustand | Context – oder ein Store wie Zustand oder Redux |

Erst für die letzte Zeile brauchst du überhaupt „State Management“ im engeren Sinn. Und oft ist sie kleiner, als man denkt.

## Die Faustregeln

1. **So lokal wie möglich.** State gehört in die tiefste Komponente, die ihn braucht. Nur wenn mehrere Komponenten ihn teilen, wandert er nach oben.
2. **Serverdaten sind kein Client-State.** Sie gehören dem Server – nimm ein Werkzeug, das Caching und Aktualisieren beherrscht.
3. **Was in die URL gehört, gehört in die URL.** Dann funktionieren Neuladen, Teilen und der Zurück-Button.
4. **Abgeleitetes nicht speichern.** Summen, gefilterte Listen und Zähler berechnest du beim Rendern.

## Context oder Store?

**Context** ist eingebaut und reicht für Werte, die sich selten ändern (Farbschema, Sprache, angemeldeter Nutzer) oder überschaubar sind. Ändert sich ein Context-Wert, rendern allerdings **alle** Komponenten neu, die ihn lesen.

Ein **Store** wie **Zustand** oder **Redux Toolkit** lohnt sich, wenn viel State an vielen Stellen gelesen und geändert wird. Komponenten abonnieren dort nur den Teil, den sie brauchen (**Selektoren**), und rendern nur neu, wenn sich genau dieser Teil ändert.

| Merkmal | Context + Reducer | Zustand | Redux Toolkit |
|---|---|---|---|
| Installation | eingebaut | kleines Paket | zwei Pakete |
| Provider nötig | ja | nein | ja |
| Neu rendern | alle Leser des Contexts | nur bei geändertem Selektor | nur bei geändertem Selektor |
| Werkzeuge | React DevTools | DevTools-Middleware | Redux DevTools, RTK Query |
| Passt für | kleine bis mittlere Apps | die meisten Apps | große Apps, große Teams |

Die nächsten drei Lektionen zeigen alle drei Ansätze.
