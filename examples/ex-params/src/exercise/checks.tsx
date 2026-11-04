import type { Check } from './check-kit';

export const exercise = 'ex-params';

export const checks: Check[] = [
  {
    id: 'shows-product',
    run: async (t) => {
      await t.click(t.$$('#list a').find((a) => a.textContent === 'Tea')!);
      t.expect(t.path() === '/products/2', `The Tea link should lead to /products/2, the URL is ${t.path()}`);
      t.expectText('#name', 'Tea');
      t.expectText('#price', '2.90');
    },
  },
  {
    id: 'direct-url',
    run: async (t) => {
      await t.navigate('/products/3');
      t.expectText('#name', 'Cocoa');
    },
  },
  {
    id: 'not-found',
    run: async (t) => {
      await t.navigate('/products/42');
      t.expectText('#not-found', 'Product not found');
    },
  },
  {
    id: 'back-button',
    run: async (t) => {
      await t.navigate('/products/1');
      await t.click(t.button('Back to list'));
      t.expect(t.path() === '/', `"Back to list" should navigate to /, the URL is ${t.path()}`);
      t.expect(t.$$('#list a').length === 3, 'The product list should be shown again');
    },
  },
];
