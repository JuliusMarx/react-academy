---
title: Semantisches HTML in JSX
minutes: 8
summary: |-
  - Barrierefreiheit beginnt mit dem richtigen HTML-Element. Native Elemente bringen Rolle, Fokus und Tastaturbedienung schon mit.
  - Klickbares ist ein `<button>`, kein `<div onClick>`. Ein `<div>` ist nicht per Tab erreichbar, reagiert nicht auf Enter und Leertaste und hat keine Rolle. Navigation ist ein `<a href>`.
  - Jedes Formularfeld braucht ein Label: das Feld in `<label>` einschließen oder `<label htmlFor>` und `id` verbinden. In JSX heißt das Attribut `htmlFor`.
  - Überschriften `<h1>`–`<h6>` bilden die Gliederung, ohne Ebenen zu überspringen. Landmarks wie `<header>`, `<nav>`, `<main>` und `<footer>` machen Bereiche direkt anspringbar.
  - Bilder brauchen `alt`: eine Beschreibung bei informativen Bildern, `alt=""` bei dekorativen.
  - Fragmente `<>…</>` statt Wrapper-`<div>`s, wenn die Struktur zählt – etwa direkt in `<ul>`, `<table>` oder `<dl>`.

  ```tsx
  <main>
    <h1>Einstellungen</h1>
    <label htmlFor="email">E-Mail</label>
    <input id="email" type="email" />
    <button onClick={save}>Speichern</button>
  </main>
  ```
quiz:
  - question: "Warum ist `<button onClick={save}>` besser als `<div onClick={save}>`?"
    options: ["Es gibt keinen Unterschied, solange es gleich aussieht","Ein `<div>` kann kein `onClick` haben","Der `<button>` rendert schneller","Der `<button>` ist per Tab erreichbar, reagiert auf Enter und Leertaste und wird als Button angesagt – ohne zusätzlichen Code"]
    answer: 3
    explanation: "Native Elemente bringen Rolle, Fokus und Tastaturbedienung mit. Beim `<div>` müsstest du `role`, `tabIndex` und `onKeyDown` selbst nachbauen."
  - question: "Wie verbindest du in JSX ein Label mit einem Eingabefeld, das nicht im Label steht?"
    options: ["`<label htmlFor=\"email\">` und `<input id=\"email\" />`","`<label for=\"email\">`","`<label name=\"email\">`","Gar nicht, das Feld muss im Label stehen"]
    answer: 0
  - question: "Welchen `alt`-Text bekommt ein rein dekoratives Bild?"
    options: ["Den Dateinamen","`alt=\"\"` – leer, damit Screenreader es überspringen","Gar kein `alt`-Attribut","`alt=\"Bild\"`"]
    answer: 1
---

# Semantisches HTML in JSX

Barrierefreiheit (*Accessibility*, kurz a11y) heißt: Alle können deine App bedienen – mit Maus, nur mit Tastatur, mit Screenreader, mit Vergrößerung. Der größte Hebel dafür ist kein Spezialwissen, sondern das richtige HTML-Element. JSX ist HTML – alles, was du über gutes HTML weißt, gilt auch hier.

## Native Elemente zuerst

Ein `<div>` mit `onClick` sieht aus wie ein Button, ist aber keiner:

```tsx
// ✗ Kein Fokus, keine Tastatur, keine Rolle
<div className="button" onClick={save}>Speichern</div>

// ✓ Alles eingebaut
<button onClick={save}>Speichern</button>
```

| Was der `<button>` mitbringt | `<div onClick>` |
|---|---|
| per Tab erreichbar | nein |
| Enter und Leertaste lösen aus | nein |
| Screenreader sagt „Button“ | nein |
| `disabled` sperrt ihn | nein |

Das gilt für alle Elemente: Links zu anderen Seiten sind `<a href>`, Auswahl ist `<select>` oder `<input type="checkbox">`, Formulare sind `<form>`. Nachbauen kannst du das zwar mit `role`, `tabIndex` und Tastatur-Handlern – aber nur mit viel Aufwand und Fehlerrisiko.

> [!TIP]
> In einem `<form>` sendet jeder `<button>` das Formular ab. Soll er das nicht, gib ihm `type="button"`.

## Labels

Jedes Formularfeld braucht ein Label. Der Screenreader sagt es beim Fokussieren an, und ein Klick darauf fokussiert das Feld. Zwei Wege:

```tsx
// Feld im Label
<label>
  <input type="checkbox" /> Angemeldet bleiben
</label>

// Label und Feld über id verbunden
<label htmlFor="email">E-Mail</label>
<input id="email" type="email" />
```

In JSX heißt das Attribut `htmlFor`, nicht `for` – wie `className` statt `class`. Ein `placeholder` ersetzt kein Label: Er verschwindet beim Tippen und wird nicht überall angesagt.

## Überschriften und Landmarks

Screenreader-Nutzer springen oft von Überschrift zu Überschrift. Deshalb:

- Eine `<h1>` pro Seite, darunter `<h2>`, `<h3>` … ohne Ebenen zu überspringen.
- Die Ebene folgt der Gliederung, nicht der gewünschten Schriftgröße – die regelst du mit CSS.

**Landmarks** markieren die großen Bereiche einer Seite. Man kann sie direkt anspringen:

| Element | Landmark |
|---|---|
| `<header>` | banner (Kopfbereich der Seite) |
| `<nav>` | navigation |
| `<main>` | main – einmal pro Seite |
| `<aside>` | complementary |
| `<footer>` | contentinfo (Fußbereich der Seite) |
| `<section>` mit Namen | region |

`<header>` und `<footer>` zählen nur auf oberster Ebene als Landmark – innerhalb von `<main>`, `<article>` oder `<section>` sind sie einfache Gruppen. Gibt es mehrere `<nav>`, unterscheide sie mit einem Namen: `<nav aria-label="Hauptmenü">`.

## Bilder

Jedes `<img>` braucht `alt`:

```tsx
<img src={chart} alt="Umsatz hat sich von 10 auf 20 verdoppelt" />
<img src={ornament} alt="" />
```

Bei informativen Bildern beschreibt `alt` den Inhalt – nicht „Bild von …“. Dekorative Bilder bekommen ein **leeres** `alt=""`, damit Screenreader sie überspringen. Fehlt `alt` ganz, lesen manche den Dateinamen vor.

## Wrapper-divs, die die Struktur stören

Eine Komponente muss ein einzelnes Element zurückgeben. Ein `<div>` drumherum zerstört aber manchmal die Struktur:

```tsx
// ✗ <div> direkt in <ul> – keine gültige Liste mehr
function Items() {
  return (
    <div>
      <li>Äpfel</li>
      <li>Birnen</li>
    </div>
  );
}

// ✓ <>…</> fügt kein eigenes Element ein
function Items() {
  return (
    <>
      <li>Äpfel</li>
      <li>Birnen</li>
    </>
  );
}
```

Dasselbe gilt für `<tr>` in Tabellen und `<dt>`/`<dd>` in `<dl>`. Brauchst du in einer Liste einen `key`, schreib `<Fragment key={id}>`.

Probier es aus: Geh mit Tab durch die Seite. Der `<div>`-Button wird übersprungen, der echte Button reagiert auf Enter und Leertaste.

::tryit{semantic-html}
