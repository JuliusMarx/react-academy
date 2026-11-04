import type { Check } from './check-kit';

export const exercise = 'ex-timer';

const seconds = (t: Parameters<Check['run']>[0]) => Number(t.text('#seconds'));

export const checks: Check[] = [
  {
    id: 'counts',
    run: async (t) => {
      const start = Date.now();
      await t.click(t.button('Start'));
      await t.settle(3300);
      const s = seconds(t);
      // Compare with the time that really passed – background tabs delay timers.
      const elapsed = Math.round((Date.now() - start) / 1000);
      t.expect(s >= 2, `After ${elapsed} seconds the timer shows ${s} – it should count up once per second`);
      t.expect(s <= elapsed + 1, `After ${elapsed} seconds the timer already shows ${s} – is more than one interval running? Clean up the interval.`);
    },
  },
  {
    id: 'stops',
    run: async (t) => {
      await t.click(t.button('Stop'));
      const before = seconds(t);
      await t.settle(1600);
      const after = seconds(t);
      t.expect(after === before, `After Stop the timer went on from ${before} to ${after}`);
    },
  },
  {
    id: 'resets',
    run: async (t) => {
      await t.click(t.button('Reset'));
      t.expectText('#seconds', '0');
    },
  },
];
