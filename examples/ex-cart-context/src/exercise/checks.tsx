import { Component, type ReactNode } from 'react';
import type { Check } from './check-kit';
import { useFavorites } from '../favorites';

export const exercise = 'ex-cart-context';

class Catch extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null };
  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }
  render() {
    return this.state.message ? <p id="caught">{this.state.message}</p> : this.props.children;
  }
}

function Outside() {
  useFavorites();
  return <p>no error</p>;
}

export const checks: Check[] = [
  {
    id: 'shared-state',
    run: async (t) => {
      await t.click(t.button('Save Risotto'));
      t.expectText('#count', '♥ 1');
      t.expect(t.button('Risotto').getAttribute('aria-pressed') === 'true', 'The Risotto button should show it is saved');
    },
  },
  {
    id: 'toggles',
    run: async (t) => {
      await t.click(t.button('Save Curry'));
      t.expectText('#count', '♥ 2');
      await t.click(t.button('Saved Risotto'));
      t.expectText('#count', '♥ 1');
    },
  },
  {
    id: 'outside-provider',
    run: async (t) => {
      const view = await t.render(
        <Catch>
          <Outside />
        </Catch>,
      );
      t.expect(view.$$('#caught').length === 1, 'useFavorites() outside <FavoritesProvider> should throw an error');
      view.expectText('#caught', 'useFavorites must be used inside <FavoritesProvider>');
    },
  },
];
