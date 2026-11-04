// React Academy test exercise – you don't need to change this file.
// Runs your tests, shows the results and then checks them against broken versions of the code.
import { runTests } from './testing/runner';
import { showReport } from './testing/report';
import { checks, exercise } from './exercise/checks';
import { runChecks } from './exercise/check-kit';
import './index.css';

import.meta.hot?.on('vite:beforeUpdate', () => location.reload());

import.meta.glob('./**/*.test.{ts,tsx}', { eager: true });

showReport(await runTests(), document.getElementById('root')!);
await runChecks(exercise, checks);
