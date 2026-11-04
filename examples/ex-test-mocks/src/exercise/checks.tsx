import type { Check } from './check-kit';

export const exercise = 'ex-test-mocks';

export const checks: Check[] = [
  { id: 'tests-pass', run: (t) => t.runTests(2) },
  { id: 'catches-argument', run: (t) => t.expectCaught('WrongArgument', 'A form that passes a different email to onSubscribe passes your tests – check the argument') },
  { id: 'catches-invalid', run: (t) => t.expectCaught('CallsWhenInvalid', 'A form that calls onSubscribe for invalid emails passes your tests') },
];
