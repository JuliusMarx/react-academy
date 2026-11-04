// React Academy exercise checker – you don't need to change this file.
// After every save the page reloads, runs the checks in ./checks.tsx against the running app
// and reports the results to the course page.
import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

export interface Check {
  /** Matches the label shown on the course page. */
  id: string;
  run: (t: TestKit) => Promise<void> | void;
}

export interface CheckResult {
  id: string;
  passed: boolean;
  message?: string;
}

class CheckFailed extends Error {}

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class TestKit {
  constructor(
    /** Queries only look inside this element – the app, or a component rendered with render(). */
    private readonly root: HTMLElement,
    /** Errors React reported while rendering (e.g. an exception in a component). */
    private readonly errors: unknown[],
  ) {}

  /** The first element matching the selector – fails the check if there is none. */
  $(selector: string): HTMLElement {
    const el = this.root.querySelector<HTMLElement>(selector);
    if (!el) throw new CheckFailed(`Nothing matches "${selector}"`);
    return el;
  }

  $$(selector: string): HTMLElement[] {
    return [...this.root.querySelectorAll<HTMLElement>(selector)];
  }

  /** Text of the element (or of everything, without a selector), whitespace collapsed. */
  text(selector?: string): string {
    const el = selector ? this.$(selector) : this.root;
    return el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  /** A button whose text contains the given label. */
  button(label: string): HTMLElement {
    const el = this.$$('button').find((b) => b.textContent?.includes(label));
    if (!el) throw new CheckFailed(`No button with the text "${label}"`);
    return el;
  }

  /**
   * Renders a component on its own (outside the app), e.g. to test it with different props.
   * Returns a kit whose queries only look inside that component.
   */
  async render(node: ReactNode): Promise<TestKit> {
    const container = document.createElement('div');
    container.hidden = true;
    document.body.append(container);
    createRoot(container, { onUncaughtError: (error) => this.errors.push(error) }).render(node);
    const kit = new TestKit(container, this.errors);
    await kit.settle();
    return kit;
  }

  async click(target: string | HTMLElement): Promise<void> {
    (typeof target === 'string' ? this.$(target) : target).click();
    await this.settle();
  }

  /**
   * Types into an input or textarea like a user would. React tracks the value of controlled inputs,
   * so the value is set via the native setter before the input event fires.
   */
  async type(target: string | HTMLElement, value: string): Promise<void> {
    const input = (typeof target === 'string' ? this.$(target) : target) as HTMLInputElement | HTMLTextAreaElement;
    const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await this.settle();
  }

  /** Picks an option of a <select> by its value. */
  async select(target: string | HTMLElement, value: string): Promise<void> {
    const select = (typeof target === 'string' ? this.$(target) : target) as HTMLSelectElement;
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!.call(select, value);
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await this.settle();
  }

  /** Waits until React has updated the page – fails if the app crashed meanwhile. */
  async settle(ms = 0): Promise<void> {
    await sleep(ms);
    await nextFrame();
    await sleep(0);
    if (this.errors.length) {
      const error = this.errors[this.errors.length - 1];
      throw new CheckFailed(`The app crashed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /** Retries the assertion for a while – for things that take time, like loading data. */
  async eventually(assertion: () => void, timeoutMs = 3000): Promise<void> {
    const start = Date.now();
    for (;;) {
      try {
        assertion();
        return;
      } catch (e) {
        if (Date.now() - start > timeoutMs) throw e;
        await this.settle(100);
      }
    }
  }

  expect(condition: unknown, message: string): void {
    if (!condition) throw new CheckFailed(message);
  }

  expectText(selector: string, expected: string | RegExp): void {
    const actual = this.text(selector);
    const ok = typeof expected === 'string' ? actual.includes(expected) : expected.test(actual);
    this.expect(ok, `Expected "${selector}" to contain ${expected}, but it shows "${actual}"`);
  }
}

export async function runChecks(exercise: string, checks: Check[], errors: unknown[]): Promise<void> {
  const app = document.getElementById('root')!;
  const kit = new TestKit(app, errors);
  const results: CheckResult[] = [];
  try {
    await kit.settle(50);
  } catch (e) {
    return reportCrash(exercise, checks, e);
  }
  // Checks run in order on the same app, so later ones see what earlier ones clicked.
  for (const check of checks) {
    try {
      await check.run(kit);
      results.push({ id: check.id, passed: true });
    } catch (e) {
      results.push({ id: check.id, passed: false, message: e instanceof Error ? e.message : String(e) });
    }
  }
  report(exercise, results);
}

/** The app could not start (e.g. a syntax error or a crash on the first render): every check fails. */
export function reportCrash(exercise: string, checks: Check[], error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  report(exercise, checks.map((c) => ({ id: c.id, passed: false, message })));
}

function report(exercise: string, results: CheckResult[]): void {
  console.table(results);
  (window as unknown as { __exerciseResults?: unknown }).__exerciseResults = results;
  // The course page embeds this preview; window.top is the course page.
  window.top?.postMessage({ type: 'react-academy:exercise-results', exercise, results }, '*');
}
