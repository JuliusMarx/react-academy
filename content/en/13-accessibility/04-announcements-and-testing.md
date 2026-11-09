---
title: Announcing changes and testing
minutes: 9
summary: |-
  - When something changes without focus moving there ("Saved", "12 results"), a screen reader only notices through a **live region**.
  - `role="status"` announces politely, when nothing else is going on. `role="alert"` interrupts – only for important, urgent messages. In general: `aria-live="polite"` or `"assertive"`.
  - The region has to be in the DOM before its text changes. So always render it and only swap the content – don't insert it together with the message.
  - In tests, query with `getByRole` and a name: what Testing Library can't find this way, screen readers often can't either. Check focus with `toHaveFocus()` and `user.tab()`.
  - axe finds many problems automatically: as a browser extension (axe DevTools) or with `axe-core` in tests, e.g. via `vitest-axe`. The contrast check doesn't work in jsdom.
  - Automated tests only find some of the problems. Check yourself: keyboard only, with a screen reader, at 200 % zoom.

  ```tsx
  // The region is always there – only its text changes
  <p role="status">{saved ? 'Saved' : ''}</p>
  ```
quiz:
  - question: "Why does `{saved && <p role=\"status\">Saved</p>}` show the message, but often isn't announced?"
    options: ["`role=\"status\"` doesn't exist", "The live region only appears together with the text – screen readers only announce changes in regions that already existed", "Because `&&` doesn't work in JSX", "Screen readers only ever announce `role=\"alert\"`"]
    answer: 1
    explanation: "Always render the region and only swap the content: `<p role=\"status\">{saved ? 'Saved' : ''}</p>`."
  - question: "When do you use `role=\"alert\"` instead of `role=\"status\"`?"
    options: ["Always, so nothing gets missed","For search results while typing","Only for important, urgent messages – `alert` interrupts whatever the screen reader is reading","Never, `alert` is deprecated"]
    answer: 2
  - question: "A test with axe reports no violations. What does that mean?"
    options: ["That axe isn't set up correctly","The app is fully accessible","The app meets all WCAG criteria","The automatically checkable rules pass – whether the page is really usable only shows in a test with keyboard and screen reader"]
    answer: 3
---

# Announcing changes and testing

Sighted users notice when "Saved" appears somewhere. A screen reader, however, only reads where the focus is. For messages that show up elsewhere, there are **live regions**. And to keep it all working, you test it.

## Live regions

A live region is an element whose changes the screen reader announces by itself:

| Markup | Announcement | Used for |
|---|---|---|
| `role="status"` | politely, when nothing else is going on | "Saved", "12 results", progress |
| `role="alert"` | immediately, interrupting | errors that matter right now |
| `aria-live="polite"` | like `status` | general regions |
| `aria-live="assertive"` | like `alert` | use sparingly |

The most important rule: the region has to **already exist** before its content changes. Screen readers watch regions that are there – one that appears together with its text is often not announced at all.

```tsx
// ✗ Region and text appear at the same time
{saved && <p role="status">Saved</p>}

// ✓ The region is always there, only the text changes
<p role="status">{saved ? 'Saved' : ''}</p>
```

With `role="alert"`, most screen readers also announce newly inserted elements – but you shouldn't rely on it.

- Don't announce every change. Too many messages are annoying and drown out the important ones.
- If the new element gets focus anyway (e.g. a dialog), you don't need a live region.

## Testing with roles

Testing Library (chapter 11) queries elements the way assistive technologies see them: by **role** and **accessible name**. So every test checks accessibility along the way:

```tsx
render(<Newsletter />);

screen.getByRole('heading', { level: 2, name: 'Newsletter' });
screen.getByRole('textbox', { name: 'Email' }); // only finds the field if it has a label
screen.getByRole('button', { name: 'Subscribe' });
screen.getByRole('status'); // the live region
```

`getByRole('button')` doesn't find a `<div onClick>`, and `getByRole('textbox', { name })` doesn't find a field without a label. By default `getByRole` skips elements with `aria-hidden` – just like a screen reader.

You can test focus, too:

```tsx
const user = userEvent.setup();
render(<Toolbar />);

await user.tab();
expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
```

## axe

**axe** by Deque checks a page against a long list of rules: missing labels and `alt` texts, buttons without a name, invalid ARIA, too little contrast and more. You can use it in two ways:

- **In the browser:** The *axe DevTools* extension for Chrome, Edge and Firefox checks the open page. Lighthouse in Chrome DevTools also uses axe for its accessibility report.
- **In tests:** The `axe-core` library checks rendered components. For Vitest there is `vitest-axe` with the `toHaveNoViolations()` matcher:

```bash
npm install -D vitest-axe
```

```ts
// src/setupTests.ts
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// In the current npm release (0.1.0), `vitest-axe/extend-expect` only adds types –
// the matcher has to be registered by hand
expect.extend(axeMatchers);
```

```tsx
import { axe } from 'vitest-axe';

it('has no axe violations', async () => {
  const { container } = render(<Newsletter />);
  expect(await axe(container)).toHaveNoViolations();
});
```

> [!WARNING]
> `vitest-axe` works with jsdom, not with happy-dom. And jsdom doesn't compute layout – axe can't check contrast there. Use the browser extension or a Playwright test with `@axe-core/playwright` for that.

In the example below, the tests run in a real browser. There the test calls `axe.run()` from `axe-core` directly and checks the list of violated rules.

::tryit{a11y-tests}

## What tools don't find

Automated checks only find some of the problems. Whether an `alt` text describes the image well, whether focus lands in the right place after deleting, or whether an announcement makes sense – no tool can tell. So also check by hand:

1. **Keyboard only:** Tab, Shift+Tab, Enter, Space, Escape, arrow keys. Is focus always visible? Can you get everywhere – and back out?
2. **With a screen reader:** VoiceOver (macOS, iOS), NVDA (Windows, free), TalkBack (Android). Even a few minutes reveal a lot.
3. **With zoom:** At 200 %, everything must still be readable and usable.
