import type { Check } from './check-kit';
import ProgressBar from '../ProgressBar';

export const exercise = 'ex-class-names';

const activeTabs = (t: Parameters<Check['run']>[0]) => t.$$('nav button.tab.active').map((b) => b.textContent);

export const checks: Check[] = [
  {
    id: 'tab-classes',
    run: (t) => {
      const tabs = t.$$('nav button');
      t.expect(tabs.length === 3 && tabs.every((b) => b.classList.contains('tab')), 'All three tabs should have the class "tab"');
      t.expect(activeTabs(t).join() === 'Profile', `At first only Profile should be active, active: ${activeTabs(t).join(', ') || 'none'}`);
    },
  },
  {
    id: 'switches',
    run: async (t) => {
      await t.click(t.button('Settings'));
      t.expect(activeTabs(t).join() === 'Settings', `After clicking Settings only Settings should be active, active: ${activeTabs(t).join(', ') || 'none'}`);
      t.expectText('#heading', 'Settings');
    },
  },
  {
    id: 'bar-width',
    run: async (t) => {
      const view = await t.render(<ProgressBar percent={40} />);
      const width = view.$('.bar').style.width;
      t.expect(width === '40%', `With percent={40} the bar should have style width 40%, it has "${width || 'none'}"`);
    },
  },
  {
    id: 'bar-clamped',
    run: async (t) => {
      const over = (await t.render(<ProgressBar percent={150} />)).$('.bar').style.width;
      const under = (await t.render(<ProgressBar percent={-20} />)).$('.bar').style.width;
      t.expect(over === '100%', `percent={150} should give 100%, it gives "${over || 'none'}"`);
      t.expect(under === '0%', `percent={-20} should give 0%, it gives "${under || 'none'}"`);
    },
  },
];
