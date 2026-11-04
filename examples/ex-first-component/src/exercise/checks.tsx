import type { Check } from './check-kit';
import Greeting from '../Greeting';

export const exercise = 'ex-first-component';

export const checks: Check[] = [
  {
    id: 'greeting-renders',
    run: async (t) => {
      const view = await t.render(<Greeting />);
      view.expectText('h2.greeting', 'Hello from my component!');
    },
  },
  {
    id: 'heading',
    run: (t) => t.expectText('h1', 'My first app'),
  },
  {
    id: 'used-twice',
    run: (t) => {
      const count = t.$$('.greeting').length;
      t.expect(count === 2, `Expected 2 greetings in the app, found ${count}`);
    },
  },
];
