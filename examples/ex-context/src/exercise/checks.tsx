import type { Check } from './check-kit';
import ThemedButton from '../ThemedButton';
import { ThemeContext } from '../theme';

export const exercise = 'ex-context';

const themes = (t: Parameters<Check['run']>[0]) => t.$$('button.themed').map((b) => (b.classList.contains('dark') ? 'dark' : 'light'));

export const checks: Check[] = [
  {
    id: 'reads-context',
    run: async (t) => {
      const view = await t.render(
        <ThemeContext value="dark">
          <ThemedButton>Test</ThemedButton>
        </ThemeContext>,
      );
      t.expect(view.$('button').classList.contains('dark'), 'Inside <ThemeContext value="dark"> the button should have the class "dark"');
    },
  },
  {
    id: 'default-light',
    run: async (t) => {
      const view = await t.render(<ThemedButton>Test</ThemedButton>);
      t.expect(view.$('button').classList.contains('light'), 'Without a provider the button should use the default "light"');
    },
  },
  {
    id: 'toggles',
    run: async (t) => {
      t.expect(themes(t).join() === 'light,light', `At first both buttons should be light, they are ${themes(t).join(', ')}`);
      await t.click(t.button('Toggle theme'));
      t.expect(themes(t).join() === 'dark,dark', `After Toggle theme both buttons should be dark, they are ${themes(t).join(', ')}`);
    },
  },
];
