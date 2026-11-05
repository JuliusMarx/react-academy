---
title: Komponentenbibliotheken
minutes: 6
summary: |-
  - Dialoge, Dropdowns oder Datumsauswahlen, die mit Tastatur und Screenreader funktionieren, sind viel Arbeit – dafür gibt es Bibliotheken.
  - **Komplett gestylt** (MUI, Mantine, Chakra UI): fertige Komponenten mit eigenem Design, anpassbar über Themes.
  - **Headless** (Radix UI, React Aria, Headless UI, Base UI): Verhalten, Fokus, Tastatursteuerung und ARIA – das Aussehen machst du selbst, z. B. mit Tailwind.
  - **shadcn/ui** kopiert die Komponenten als Quellcode in dein Projekt (`npx shadcn add dialog`). Du kannst alles ändern, sie aktualisieren sich aber nicht von selbst.
  - Faustregel: schnelle interne App → gestylte Bibliothek; eigenes Design → Headless oder shadcn/ui; ein paar einfache Elemente → selbst bauen.

  ```tsx
  import * as Dialog from '@radix-ui/react-dialog';

  <Dialog.Root>
    <Dialog.Trigger>Öffnen</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <Dialog.Content className="rounded-xl bg-white p-6">
        <Dialog.Title>Einstellungen</Dialog.Title>
        <Dialog.Close>Schließen</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  ```

  > [!TIP] Für viele einfache Fälle reicht das HTML-Element `<dialog>` – es bringt Fokusverwaltung und Escape schon mit.
quiz:
  - question: "Was ist eine Headless-Bibliothek wie Radix UI oder React Aria?"
    options: ["Fertiges Verhalten und Barrierefreiheit ohne vorgegebenes Aussehen – das Styling machst du selbst","Eine Bibliothek ohne JavaScript","Eine Bibliothek nur für Server","Ein CSS-Framework"]
    answer: 0
  - question: "Wie funktioniert shadcn/ui?"
    options: ["Als npm-Paket, das du nicht ändern kannst", "Du kopierst den Code der Komponenten in dein Projekt und passt ihn selbst an", "Als Browser-Erweiterung", "Nur mit Next.js"]
    answer: 1
---

# Komponentenbibliotheken

Buttons und Karten sind schnell gebaut. Ein Dialog, ein Dropdown-Menü oder eine Datumsauswahl, die mit Tastatur und Screenreader richtig funktionieren, sind dagegen viel Arbeit. Dafür gibt es Bibliotheken.

## Drei Arten

| Art | Beispiele | Du bekommst … |
|---|---|---|
| Komplett gestylt | MUI, Mantine, Chakra UI | fertige Komponenten mit eigenem Design, anpassbar über Themes |
| Headless | Radix UI, React Aria, Headless UI, Base UI | Verhalten, Tastatursteuerung und ARIA – ohne Aussehen |
| Zum Kopieren | shadcn/ui | den Quellcode der Komponenten (meist Radix + Tailwind) direkt in deinem Projekt |

## Headless: Verhalten ohne Aussehen

Eine Headless-Bibliothek kümmert sich um das Schwierige – Fokus festhalten, Escape schließt, Pfeiltasten wandern durchs Menü, die richtigen ARIA-Attribute – und überlässt dir das Styling, z. B. mit Tailwind:

```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger className="rounded bg-sky-700 px-3 py-1 text-white">Öffnen</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6">
      <Dialog.Title>Einstellungen</Dialog.Title>
      <Dialog.Close>Schließen</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## shadcn/ui

**shadcn/ui** ist keine klassische Bibliothek: Ein Befehl wie `npx shadcn add dialog` kopiert die Komponente als Quellcode in dein Projekt. Du besitzt den Code und kannst alles ändern – im Gegenzug aktualisiert er sich nicht von selbst.

## Was passt?

- **Schnell eine interne Anwendung bauen**: eine komplett gestylte Bibliothek wie MUI oder Mantine.
- **Eigenes Design, aber barrierefrei**: Headless-Komponenten oder shadcn/ui.
- **Ein paar einfache Elemente**: selbst bauen – mit echten `<button>`- und `<label>`-Elementen.

> [!TIP]
> Bevor du einen Dialog selbst baust: Das HTML-Element `<dialog>` bringt Fokusverwaltung und Escape bereits mit. Für viele einfache Fälle reicht es.
