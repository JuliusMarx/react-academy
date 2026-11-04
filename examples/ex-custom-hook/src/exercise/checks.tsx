import { useState } from 'react';
import type { Check } from './check-kit';
import { useLocalStorage } from '../useLocalStorage';

export const exercise = 'ex-custom-hook';

function Probe({ storageKey }: { storageKey: string }) {
  const [value, setValue] = useLocalStorage(storageKey, 'start');
  const [, rerender] = useState(0);
  return (
    <>
      <output>{value}</output>
      <button onClick={() => setValue('changed')}>change</button>
      <button onClick={() => rerender((n) => n + 1)}>rerender</button>
    </>
  );
}

const read = (key: string) => localStorage.getItem(key);

export const checks: Check[] = [
  {
    id: 'initial-value',
    run: async (t) => {
      localStorage.removeItem('check-a');
      const view = await t.render(<Probe storageKey="check-a" />);
      view.expectText('output', 'start');
    },
  },
  {
    id: 'stores',
    run: async (t) => {
      localStorage.removeItem('check-b');
      const view = await t.render(<Probe storageKey="check-b" />);
      await view.click(view.button('change'));
      view.expectText('output', 'changed');
      t.expect(read('check-b') === '"changed"', `localStorage["check-b"] should be '"changed"' (JSON), it is ${read('check-b')}`);
    },
  },
  {
    id: 'reads-stored',
    run: async (t) => {
      localStorage.setItem('check-c', JSON.stringify('remembered'));
      const view = await t.render(<Probe storageKey="check-c" />);
      view.expectText('output', 'remembered');
      await view.click(view.button('rerender'));
      view.expectText('output', 'remembered');
    },
  },
];
