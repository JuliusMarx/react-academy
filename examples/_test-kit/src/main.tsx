// React Academy test runner – you don't need to change this file.
// It runs every *.test.tsx file in the browser and shows the results, like "vitest" in a terminal.
import { runTests } from './testing/runner';
import { showReport } from './testing/report';
import './index.css';

import.meta.hot?.on('vite:beforeUpdate', () => location.reload());

import.meta.glob('./**/*.test.{ts,tsx}', { eager: true });

showReport(await runTests(), document.getElementById('root')!);
