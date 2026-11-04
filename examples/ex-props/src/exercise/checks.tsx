import type { Check } from './check-kit';
import UserBadge from '../UserBadge';

export const exercise = 'ex-props';

export const checks: Check[] = [
  {
    id: 'shows-name',
    run: async (t) => {
      const view = await t.render(<UserBadge name="Zoe" role="Tester" />);
      view.expectText('strong', 'Zoe');
    },
  },
  {
    id: 'shows-role',
    run: async (t) => {
      const view = await t.render(<UserBadge name="Zoe" role="Tester" />);
      view.expectText('.role', 'Tester');
    },
  },
  {
    id: 'default-role',
    run: async (t) => {
      const view = await t.render(<UserBadge name="Zoe" />);
      view.expectText('.role', 'Member');
    },
  },
  {
    id: 'three-badges',
    run: (t) => {
      const badges = t.$$('.badge').map((b) => b.textContent?.replace(/\s+/g, ' ').trim());
      t.expect(badges.length === 3, `Expected 3 badges in the app, found ${badges.length}`);
      t.expect(badges[0] === 'Ada Admin', `First badge should read "Ada Admin", it reads "${badges[0]}"`);
      t.expect(badges[1] === 'Linus Member', `Second badge should read "Linus Member", it reads "${badges[1]}"`);
      t.expect(badges[2] === 'Grace Editor', `Third badge should read "Grace Editor", it reads "${badges[2]}"`);
    },
  },
];
