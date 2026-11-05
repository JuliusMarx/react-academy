---
title: Component Libraries
minutes: 6
summary: |-
  - Dialogs, dropdowns or date pickers that work with keyboard and screen reader are a lot of work – that's what libraries are for.
  - **Fully styled** (MUI, Mantine, Chakra UI): ready-made components with their own design, customizable via themes.
  - **Headless** (Radix UI, React Aria, Headless UI, Base UI): behavior, focus, keyboard control and ARIA – you do the look, e.g. with Tailwind.
  - **shadcn/ui** copies the components into your project as source code (`npx shadcn@latest add dialog`). You can change everything, but it doesn't update itself.
  - Rule of thumb: quick internal app → styled library; your own design → headless or shadcn/ui; a few simple elements → build them yourself.

  ```tsx
  import * as Dialog from '@radix-ui/react-dialog';

  <Dialog.Root>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
      <Dialog.Content className="rounded-xl bg-white p-6">
        <Dialog.Title>Settings</Dialog.Title>
        <Dialog.Description>Adjust the app.</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  ```

  > [!TIP] For many simple cases the HTML `<dialog>` element is enough – opened with `showModal()`, it already brings focus management and Escape handling.
quiz:
  - question: "What is a headless library like Radix UI or React Aria?"
    options: ["Ready-made behavior and accessibility without a predefined look – you do the styling yourself", "A library without JavaScript", "A library for servers only", "A CSS framework"]
    answer: 0
  - question: "How does shadcn/ui work?"
    options: ["As an npm package you can't change", "You copy the components' code into your project and adapt it yourself", "As a browser extension", "Only with Next.js"]
    answer: 1
---

# Component Libraries

Buttons and cards are quick to build. A dialog, a dropdown menu or a date picker that work properly with keyboard and screen reader, however, are a lot of work. That's what libraries are for.

## Three Kinds

| Kind | Examples | You get … |
|---|---|---|
| Fully styled | MUI, Mantine, Chakra UI | ready-made components with their own design, customizable via themes |
| Headless | Radix UI, React Aria, Headless UI, Base UI | behavior, keyboard control and ARIA – without a look |
| Copy-and-paste | shadcn/ui | the components' source code (usually Radix + Tailwind) directly in your project |

## Headless: Behavior Without a Look

A headless library takes care of the hard parts – trapping focus, closing on Escape, arrow keys moving through the menu, the right ARIA attributes – and leaves the styling to you, e.g. with Tailwind:

```tsx
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger className="rounded bg-sky-700 px-3 py-1 text-white">Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/40" />
    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6">
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.Description>Adjust the app.</Dialog.Description>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

## shadcn/ui

**shadcn/ui** isn't a classic library: a command like `npx shadcn@latest add dialog` copies the component into your project as source code. You own the code and can change anything – in return, it doesn't update itself.

## What Fits?

- **Quickly building an internal application**: a fully styled library like MUI or Mantine.
- **Your own design, but accessible**: headless components or shadcn/ui.
- **A few simple elements**: build them yourself – with real `<button>` and `<label>` elements.

> [!TIP]
> Before you build a dialog yourself: the HTML `<dialog>` element, opened with `showModal()`, already comes with focus management and Escape handling. For many simple cases it's enough.
