import type { Check } from './check-kit';

export const exercise = 'ex-test-events';

export const checks: Check[] = [
  { id: 'tests-pass', run: (t) => t.runTests(3) },
  { id: 'catches-step', run: (t) => t.expectCaught('StepTwo', 'A counter that adds 2 per click passes your tests') },
  { id: 'catches-negative', run: (t) => t.expectCaught('GoesNegative', 'A counter that goes below 0 passes your tests – click Decrement at 0') },
  { id: 'catches-reset', run: (t) => t.expectCaught('NoReset', 'A Reset button that does nothing passes your tests') },
];
