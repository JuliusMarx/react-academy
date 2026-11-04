import { isMock } from './mocks';

class AssertionError extends Error {}

const show = (v: unknown): string => {
  if (v instanceof HTMLElement) return `<${v.tagName.toLowerCase()}>`;
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'function') return v.name || 'function';
  try {
    return JSON.stringify(v) ?? String(v);
  } catch {
    return String(v);
  }
};

function equals(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => equals((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
}

const text = (el: Element) => el.textContent?.replace(/\s+/g, ' ').trim() ?? '';

function element(v: unknown, matcher: string): HTMLElement {
  if (!(v instanceof Element)) throw new AssertionError(`${matcher}() needs a DOM element, got ${show(v)}`);
  return v as HTMLElement;
}

function mockOf(v: unknown, matcher: string) {
  if (!isMock(v)) throw new AssertionError(`${matcher}() needs a mock function (vi.fn() or vi.spyOn()), got ${show(v)}`);
  return v;
}

type Matchers = {
  [name: string]: (actual: unknown, ...expected: any[]) => [pass: boolean, message: string, notMessage: string];
};

const matchers: Matchers = {
  toBe: (a, e) => [Object.is(a, e), `expected ${show(a)} to be ${show(e)}`, `expected ${show(a)} not to be ${show(e)}`],
  toEqual: (a, e) => [equals(a, e), `expected ${show(a)} to equal ${show(e)}`, `expected ${show(a)} not to equal ${show(e)}`],
  toStrictEqual: (a, e) => matchers.toEqual(a, e),
  toBeTruthy: (a) => [!!a, `expected ${show(a)} to be truthy`, `expected ${show(a)} not to be truthy`],
  toBeFalsy: (a) => [!a, `expected ${show(a)} to be falsy`, `expected ${show(a)} not to be falsy`],
  toBeNull: (a) => [a === null, `expected ${show(a)} to be null`, 'expected value not to be null'],
  toBeDefined: (a) => [a !== undefined, 'expected value to be defined', `expected ${show(a)} to be undefined`],
  toBeUndefined: (a) => [a === undefined, `expected ${show(a)} to be undefined`, 'expected value to be defined'],
  toContain: (a, e) => [
    typeof a === 'string' ? a.includes(e) : Array.isArray(a) && a.includes(e),
    `expected ${show(a)} to contain ${show(e)}`,
    `expected ${show(a)} not to contain ${show(e)}`,
  ],
  toHaveLength: (a, n) => {
    const len = (a as { length?: number })?.length;
    return [len === n, `expected length ${n}, got ${len}`, `expected length not to be ${n}`];
  },
  toBeGreaterThan: (a, n) => [(a as number) > n, `expected ${show(a)} to be greater than ${n}`, `expected ${show(a)} not to be greater than ${n}`],
  toBeGreaterThanOrEqual: (a, n) => [(a as number) >= n, `expected ${show(a)} to be >= ${n}`, `expected ${show(a)} not to be >= ${n}`],
  toBeLessThan: (a, n) => [(a as number) < n, `expected ${show(a)} to be less than ${n}`, `expected ${show(a)} not to be less than ${n}`],
  toBeLessThanOrEqual: (a, n) => [(a as number) <= n, `expected ${show(a)} to be <= ${n}`, `expected ${show(a)} not to be <= ${n}`],
  toMatch: (a, re) => {
    const ok = typeof re === 'string' ? String(a).includes(re) : (re as RegExp).test(String(a));
    return [ok, `expected ${show(a)} to match ${re}`, `expected ${show(a)} not to match ${re}`];
  },
  toThrow: (fn, expected) => {
    let error: unknown;
    try {
      (fn as () => unknown)();
    } catch (e) {
      error = e;
    }
    const message = error instanceof Error ? error.message : String(error);
    const ok = error !== undefined && (expected === undefined || (expected instanceof RegExp ? expected.test(message) : message.includes(expected)));
    return [ok, `expected function to throw${expected ? ` ${show(expected)}` : ''}${error ? `, it threw ${show(message)}` : ''}`, `expected function not to throw, it threw ${show(message)}`];
  },
  toHaveBeenCalled: (m) => {
    const n = mockOf(m, 'toHaveBeenCalled').mock.calls.length;
    return [n > 0, 'expected the mock to have been called', `expected the mock not to have been called, it was called ${n} times`];
  },
  toHaveBeenCalledTimes: (m, times) => {
    const n = mockOf(m, 'toHaveBeenCalledTimes').mock.calls.length;
    return [n === times, `expected the mock to be called ${times} times, it was called ${n} times`, `expected the mock not to be called ${times} times`];
  },
  toHaveBeenCalledWith: (m, ...args) => {
    const calls = mockOf(m, 'toHaveBeenCalledWith').mock.calls;
    return [
      calls.some((c) => equals(c, args)),
      `expected the mock to be called with ${show(args)}, calls: ${show(calls)}`,
      `expected the mock not to be called with ${show(args)}`,
    ];
  },
  toHaveBeenLastCalledWith: (m, ...args) => {
    const calls = mockOf(m, 'toHaveBeenLastCalledWith').mock.calls;
    return [equals(calls.at(-1), args), `expected the last call to be ${show(args)}, it was ${show(calls.at(-1))}`, `expected the last call not to be ${show(args)}`];
  },
  // DOM matchers like @testing-library/jest-dom
  toBeInTheDocument: (a) => [
    a instanceof Element && a.ownerDocument.contains(a),
    'expected the element to be in the document',
    'expected the element not to be in the document',
  ],
  toHaveTextContent: (a, e) => {
    const t = text(element(a, 'toHaveTextContent'));
    const ok = e instanceof RegExp ? e.test(t) : t.includes(e);
    return [ok, `expected text ${show(t)} to contain ${show(e)}`, `expected text ${show(t)} not to contain ${show(e)}`];
  },
  toBeVisible: (a) => {
    const el = element(a, 'toBeVisible');
    const visible = el.ownerDocument.contains(el) && !el.closest('[hidden]') && getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none';
    return [visible, 'expected the element to be visible', 'expected the element not to be visible'];
  },
  toBeDisabled: (a) => [(element(a, 'toBeDisabled') as HTMLButtonElement).disabled === true, 'expected the element to be disabled', 'expected the element not to be disabled'],
  toBeEnabled: (a) => [(element(a, 'toBeEnabled') as HTMLButtonElement).disabled !== true, 'expected the element to be enabled', 'expected the element not to be enabled'],
  toBeChecked: (a) => [(element(a, 'toBeChecked') as HTMLInputElement).checked === true, 'expected the element to be checked', 'expected the element not to be checked'],
  toHaveValue: (a, e) => {
    const el = element(a, 'toHaveValue') as HTMLInputElement;
    const v = el.type === 'number' ? (el.value === '' ? null : Number(el.value)) : el.value;
    return [equals(v, e), `expected value ${show(v)} to be ${show(e)}`, `expected value not to be ${show(e)}`];
  },
  toHaveClass: (a, ...classes: string[]) => {
    const el = element(a, 'toHaveClass');
    return [classes.every((c) => el.classList.contains(c)), `expected class "${el.className}" to include ${classes.join(' ')}`, `expected class "${el.className}" not to include ${classes.join(' ')}`];
  },
  toHaveAttribute: (a, name, value) => {
    const el = element(a, 'toHaveAttribute');
    const ok = el.hasAttribute(name) && (value === undefined || el.getAttribute(name) === value);
    return [ok, `expected attribute ${name}${value !== undefined ? `="${value}"` : ''}, got ${show(el.getAttribute(name))}`, `expected no attribute ${name}`];
  },
  toHaveFocus: (a) => [element(a, 'toHaveFocus').ownerDocument.activeElement === a, 'expected the element to have focus', 'expected the element not to have focus'],
};

type Expectation = { [K in keyof typeof matchers]: (...expected: any[]) => void } & {
  not: { [K in keyof typeof matchers]: (...expected: any[]) => void };
  resolves: { [K in keyof typeof matchers]: (...expected: any[]) => Promise<void> };
  rejects: { [K in keyof typeof matchers]: (...expected: any[]) => Promise<void> };
};

function build(actual: unknown, negate: boolean) {
  const target: Record<string, (...e: unknown[]) => void> = {};
  for (const [name, matcher] of Object.entries(matchers)) {
    target[name] = (...expected) => {
      const [pass, message, notMessage] = matcher(actual, ...expected);
      if (pass === negate) throw new AssertionError(negate ? notMessage : message);
    };
  }
  return target;
}

function buildAsync(promise: unknown, mode: 'resolves' | 'rejects') {
  const target: Record<string, (...e: unknown[]) => Promise<void>> = {};
  for (const name of Object.keys(matchers)) {
    target[name] = async (...expected) => {
      let value: unknown;
      try {
        value = await promise;
        if (mode === 'rejects') throw new AssertionError(`expected the promise to reject, it resolved with ${show(value)}`);
      } catch (e) {
        if (e instanceof AssertionError) throw e;
        if (mode === 'resolves') throw new AssertionError(`expected the promise to resolve, it rejected with ${show(e instanceof Error ? e.message : e)}`);
        value = e instanceof Error && name !== 'toBeInstanceOf' ? e.message : e;
      }
      build(value, false)[name](...expected);
    };
  }
  return target;
}

export function expect(actual: unknown): Expectation {
  return {
    ...build(actual, false),
    not: build(actual, true),
    resolves: buildAsync(actual, 'resolves'),
    rejects: buildAsync(actual, 'rejects'),
  } as Expectation;
}
