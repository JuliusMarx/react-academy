import type { Check } from './check-kit';

export const exercise = 'ex-temperature';

const value = (t: Parameters<Check['run']>[0], selector: string) => (t.$(selector) as HTMLInputElement).value;

export const checks: Check[] = [
  {
    id: 'celsius-to-fahrenheit',
    run: async (t) => {
      await t.type('#celsius', '100');
      t.expect(value(t, '#fahrenheit') === '212', `100 °C should show 212 in Fahrenheit, it shows "${value(t, '#fahrenheit')}"`);
    },
  },
  {
    id: 'fahrenheit-to-celsius',
    run: async (t) => {
      await t.type('#fahrenheit', '32');
      t.expect(value(t, '#celsius') === '0', `32 °F should show 0 in Celsius, it shows "${value(t, '#celsius')}"`);
      t.expect(value(t, '#fahrenheit') === '32', 'The Fahrenheit input should keep what was typed');
    },
  },
  {
    id: 'verdict',
    run: async (t) => {
      await t.type('#fahrenheit', '212');
      t.expectText('#verdict', 'Water would boil.');
      await t.type('#celsius', '50');
      t.expectText('#verdict', 'Water would not boil.');
    },
  },
];
