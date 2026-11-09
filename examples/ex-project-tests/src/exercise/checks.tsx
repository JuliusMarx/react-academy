import type { Check } from './check-kit';

export const exercise = 'ex-project-tests';

export const checks: Check[] = [
  { id: 'tests-pass', run: (t) => t.runTests(2) },
  {
    id: 'catches-validation',
    run: (t) => t.expectCaught('NoValidation', 'A form that saves the title "Hi" passes your tests – check that onSave is not called'),
  },
  {
    id: 'catches-message',
    run: (t) => t.expectCaught('NoErrorMessage', 'A form without an error message passes your tests – check the alert'),
  },
  {
    id: 'catches-body',
    run: (t) => t.expectCaught('DropsBody', 'A form that saves an empty text passes your tests – check what onSave gets'),
  },
];
