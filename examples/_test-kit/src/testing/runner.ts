import { cleanup } from '@testing-library/react';
import { restoreAllMocks } from './mocks';

type Fn = () => unknown | Promise<unknown>;
type Suite = { name: string; tests: Test[]; suites: Suite[]; before: Fn[]; after: Fn[]; parent?: Suite };
type Test = { name: string; fn: Fn };

export type TestResult = { name: string; passed: boolean; error?: string };

const root: Suite = { name: '', tests: [], suites: [], before: [], after: [] };
let current = root;

export function describe(name: string, fn: () => void): void {
  const suite: Suite = { name, tests: [], suites: [], before: [], after: [], parent: current };
  current.suites.push(suite);
  current = suite;
  try {
    fn();
  } finally {
    current = suite.parent!;
  }
}

export function it(name: string, fn: Fn): void {
  current.tests.push({ name, fn });
}

export function beforeEach(fn: Fn): void {
  current.before.push(fn);
}

export function afterEach(fn: Fn): void {
  current.after.push(fn);
}

/** React Testing Library wraps updates in act() – tell React this is a test environment. */
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Browsers don't fire focus events in a page without focus – and the preview usually doesn't have
 * it, because you're typing in the editor. user-event needs those events (e.g. for user.type), so
 * focus() fires them itself in that case.
 */
const nativeFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function focus(this: HTMLElement, options?: FocusOptions) {
  const previous = document.activeElement as HTMLElement | null;
  nativeFocus.call(this, options);
  if (document.hasFocus() || document.activeElement !== this || previous === this) return;
  if (previous && previous !== document.body) {
    previous.dispatchEvent(new FocusEvent('blur', { relatedTarget: this }));
    previous.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: this }));
  }
  this.dispatchEvent(new FocusEvent('focus', { relatedTarget: previous }));
  this.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: previous }));
};

const TIMEOUT = 5000;

function withTimeout(promise: Promise<unknown>): Promise<unknown> {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Test timed out after ${TIMEOUT} ms`)), TIMEOUT)),
  ]);
}

function chain(suite: Suite): Suite[] {
  const list: Suite[] = [];
  for (let s: Suite | undefined = suite; s; s = s.parent) list.unshift(s);
  return list;
}

async function runSuite(suite: Suite, results: TestResult[]): Promise<void> {
  for (const test of suite.tests) {
    const suites = chain(suite);
    const name = [...suites.map((s) => s.name).filter(Boolean), test.name].join(' › ');
    try {
      for (const s of suites) for (const fn of s.before) await fn();
      await withTimeout(Promise.resolve().then(test.fn));
      results.push({ name, passed: true });
    } catch (e) {
      results.push({ name, passed: false, error: e instanceof Error ? e.message : String(e) });
    } finally {
      for (const s of suites.toReversed()) for (const fn of s.after) await Promise.resolve().then(fn).catch(() => {});
      cleanup();
      restoreAllMocks();
    }
  }
  for (const child of suite.suites) await runSuite(child, results);
}

/** Runs all registered tests (again) and returns one result per test. */
export async function runTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  await runSuite(root, results);
  return results;
}
