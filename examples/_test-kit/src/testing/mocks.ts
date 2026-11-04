type AnyFn = (...args: any[]) => any;

export interface Mock<T extends AnyFn = AnyFn> {
  (...args: Parameters<T>): ReturnType<T>;
  mock: { calls: Parameters<T>[]; results: { type: 'return' | 'throw'; value: unknown }[] };
  mockImplementation(fn: T): Mock<T>;
  mockReturnValue(value: ReturnType<T>): Mock<T>;
  mockResolvedValue(value: Awaited<ReturnType<T>>): Mock<T>;
  mockRejectedValue(error: unknown): Mock<T>;
  mockClear(): Mock<T>;
  mockReset(): Mock<T>;
  mockRestore(): void;
  _isMockFunction: true;
}

const spies: Mock[] = [];

function createMock<T extends AnyFn>(impl?: T, restore?: () => void): Mock<T> {
  let implementation: AnyFn | undefined = impl;
  const mock = function (this: unknown, ...args: Parameters<T>) {
    mock.mock.calls.push(args);
    try {
      const value = implementation?.apply(this, args);
      mock.mock.results.push({ type: 'return', value });
      return value;
    } catch (e) {
      mock.mock.results.push({ type: 'throw', value: e });
      throw e;
    }
  } as Mock<T>;
  mock.mock = { calls: [], results: [] };
  mock._isMockFunction = true;
  mock.mockImplementation = (fn) => ((implementation = fn), mock);
  mock.mockReturnValue = (value) => ((implementation = () => value), mock);
  mock.mockResolvedValue = (value) => ((implementation = () => Promise.resolve(value)), mock);
  mock.mockRejectedValue = (error) => ((implementation = () => Promise.reject(error)), mock);
  mock.mockClear = () => ((mock.mock = { calls: [], results: [] }), mock);
  mock.mockReset = () => ((implementation = undefined), mock.mockClear());
  mock.mockRestore = () => restore?.();
  return mock;
}

export const vi = {
  fn<T extends AnyFn = AnyFn>(impl?: T): Mock<T> {
    return createMock(impl);
  },
  /** Replaces obj[method] with a mock that calls the original – until mockRestore() or the test ends. */
  spyOn<O extends object, K extends keyof O>(obj: O, method: K): Mock<O[K] extends AnyFn ? O[K] : never> {
    const original = obj[method] as AnyFn;
    const spy = createMock(original, () => {
      obj[method] = original as O[K];
    });
    obj[method] = spy as O[K];
    spies.push(spy);
    return spy as never;
  },
  restoreAllMocks,
  clearAllMocks() {
    spies.forEach((s) => s.mockClear());
  },
};

export function restoreAllMocks(): void {
  while (spies.length) spies.pop()!.mockRestore();
}

export function isMock(value: unknown): value is Mock {
  return typeof value === 'function' && (value as Partial<Mock>)._isMockFunction === true;
}
