import type { Check } from './check-kit';
import Badge from '../Badge';

export const exercise = 'ex-tailwind';

const has = (el: HTMLElement, classes: string[]) => classes.filter((c) => !el.classList.contains(c));

export const checks: Check[] = [
  {
    id: 'base-classes',
    run: async (t) => {
      const el = (await t.render(<Badge status="success">ok</Badge>)).$('span');
      const missing = has(el, ['inline-flex', 'rounded-full', 'px-3', 'py-1', 'text-sm', 'font-medium']);
      t.expect(!missing.length, `The badge is missing these classes: ${missing.join(', ')}`);
    },
  },
  {
    id: 'variants',
    run: async (t) => {
      const ok = (await t.render(<Badge status="success">ok</Badge>)).$('span');
      const bad = (await t.render(<Badge status="error">bad</Badge>)).$('span');
      t.expect(!has(ok, ['bg-green-100', 'text-green-800']).length, 'status="success" needs bg-green-100 text-green-800');
      t.expect(!has(bad, ['bg-red-100', 'text-red-800']).length, 'status="error" needs bg-red-100 text-red-800');
      t.expect(!ok.classList.contains('bg-red-100') && !bad.classList.contains('bg-green-100'), 'Each badge should only get the colors of its own status');
    },
  },
  {
    id: 'tailwind-applies',
    run: (t) => {
      // In the app (not hidden), Tailwind must actually have generated the CSS.
      const badge = t.$('ul span');
      const style = getComputedStyle(badge);
      t.expect(style.paddingLeft === '12px', `px-3 should give 12px padding – computed ${style.paddingLeft}. Is Tailwind set up?`);
      t.expect(style.display === 'inline-flex', `inline-flex should apply – computed display is ${style.display}`);
    },
  },
];
