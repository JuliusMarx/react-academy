// React Academy test exercise checker – you don't need to change this file.
// Your tests must pass against the real code – and fail against deliberately broken versions
// of it ("mutants" in ./mutants.tsx). That's how the checks know your tests really test something.
import { runTests, type TestResult } from '../testing/runner';
import { setMutant } from '../testing/swap';
import { mutants } from './mutants';

export interface Check {
  id: string;
  run: (t: TestKit) => Promise<unknown> | void;
}

class CheckFailed extends Error {}

export class TestKit {
  /** Runs your tests against the real code: there must be at least one, and all must pass. */
  async runTests(minTests = 1): Promise<TestResult[]> {
    setMutant(null);
    const results = await runTests();
    if (results.length < minTests) throw new CheckFailed(`Write at least ${minTests} test${minTests > 1 ? 's' : ''} (found ${results.length})`);
    const failed = results.filter((r) => !r.passed);
    if (failed.length) throw new CheckFailed(`Your tests must pass against the real code – failing: ${failed.map((f) => f.name).join(', ')}`);
    return results;
  }

  /** Runs your tests against the mutant – at least one test has to fail. */
  async expectCaught(mutant: keyof typeof mutants & string, message: string): Promise<void> {
    setMutant(mutants[mutant]);
    try {
      const results = await runTests();
      if (!results.length || results.every((r) => r.passed)) throw new CheckFailed(message);
    } finally {
      setMutant(null);
    }
  }
}

export async function runChecks(exercise: string, checks: Check[]): Promise<void> {
  const kit = new TestKit();
  const results: { id: string; passed: boolean; message?: string }[] = [];
  for (const check of checks) {
    try {
      await check.run(kit);
      results.push({ id: check.id, passed: true });
    } catch (e) {
      results.push({ id: check.id, passed: false, message: e instanceof Error ? e.message : String(e) });
    }
  }
  console.table(results);
  (window as unknown as { __exerciseResults?: unknown }).__exerciseResults = results;
  window.top?.postMessage({ type: 'react-academy:exercise-results', exercise, results }, '*');
}
