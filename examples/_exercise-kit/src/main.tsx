// React Academy exercise – you don't need to change this file.
// It starts your app and then runs the checks in ./exercise/checks.tsx.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { checks, exercise } from './exercise/checks';
import { reportCrash, runChecks } from './exercise/check-kit';

const errors: unknown[] = [];

try {
  const { default: App } = await import('./App');
  createRoot(document.getElementById('root')!, {
    onUncaughtError: (error) => errors.push(error),
  }).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  await runChecks(exercise, checks, errors);
} catch (error) {
  reportCrash(exercise, checks, error);
}
