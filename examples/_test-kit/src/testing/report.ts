import type { TestResult } from './runner';

/** Shows the test results in the preview, similar to the Vitest terminal output. */
export function showReport(results: TestResult[], target: HTMLElement): void {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  console.table(results);
  target.innerHTML = '';
  const summary = document.createElement('h1');
  summary.textContent = results.length
    ? `${failed ? '❌' : '✅'} ${passed} passed${failed ? `, ${failed} failed` : ''}`
    : 'No tests found – add a *.test.tsx file';
  summary.style.fontSize = '1.25rem';
  target.append(summary);
  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = '0';
  for (const r of results) {
    const li = document.createElement('li');
    li.style.margin = '0.4rem 0';
    li.style.color = r.passed ? '#176a40' : '#b3261e';
    li.textContent = `${r.passed ? '✓' : '✗'} ${r.name}`;
    if (r.error) {
      const pre = document.createElement('pre');
      pre.textContent = r.error;
      pre.style.cssText = 'margin:0.25rem 0 0 1.25rem;white-space:pre-wrap;color:#1b1d24;background:#fbe7e5;padding:0.4rem;border-radius:4px';
      li.append(pre);
    }
    list.append(li);
  }
  target.append(list);
}
