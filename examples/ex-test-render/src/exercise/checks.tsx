import type { Check } from './check-kit';

export const exercise = 'ex-test-render';

export const checks: Check[] = [
  { id: 'tests-pass', run: (t) => t.runTests(2) },
  { id: 'catches-name', run: (t) => t.expectCaught('HardcodedName', 'A badge that always shows "Ada" passes your tests – check the name that is passed in') },
  { id: 'catches-role', run: (t) => t.expectCaught('IgnoresRole', 'A badge that ignores the role prop passes your tests – check a custom role') },
  { id: 'catches-default', run: (t) => t.expectCaught('NoDefaultRole', 'A badge without the "Member" default passes your tests – test it without a role') },
];
