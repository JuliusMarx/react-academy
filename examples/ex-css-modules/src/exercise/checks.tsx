import type { Check } from './check-kit';

export const exercise = 'ex-css-modules';

export const checks: Check[] = [
  {
    id: 'scoped-class',
    run: (t) => {
      const section = t.$('main section');
      const cls = section.className;
      t.expect(cls && !cls.split(/\s+/).includes('card'), `The card still uses the global class "card" – use a CSS Module class instead (class is "${cls}")`);
      t.expect(/card/.test(cls), `The card's class should come from styles.card (it is "${cls || 'empty'}")`);
    },
  },
  {
    id: 'own-styles',
    run: (t) => {
      const style = getComputedStyle(t.$('main section'));
      t.expect(style.borderRadius === '12px', `The card should have border-radius 12px from its module, it has ${style.borderRadius}`);
      t.expect(getComputedStyle(t.$('main section h2')).color === 'rgb(8, 126, 164)', 'The title should be colored by styles.title');
    },
  },
  {
    id: 'no-clash',
    run: (t) => {
      const style = getComputedStyle(t.$('main section'));
      t.expect(style.backgroundColor !== 'rgb(255, 221, 221)', 'The pink background from legacy.css still applies to the card');
      t.expect(style.borderStyle !== 'dashed', 'The dashed border from legacy.css still applies to the card');
      t.expect(getComputedStyle(t.$('main section h2')).textTransform !== 'uppercase', 'The title is still uppercase from legacy.css');
    },
  },
];
