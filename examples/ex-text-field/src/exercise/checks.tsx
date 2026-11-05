import type { Check } from './check-kit';
import TextField from '../TextField';

export const exercise = 'ex-text-field';

/** Text of all elements the input's aria-describedby points to. */
function description(input: HTMLElement): string {
  const ids = (input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
  return ids.map((id) => document.getElementById(id)?.textContent ?? '').join(' ');
}

export const checks: Check[] = [
  {
    id: 'label-linked',
    run: (t) => {
      const inputs = t.$$('input') as HTMLInputElement[];
      t.expect(inputs.length === 2, `The form should have two inputs, it has ${inputs.length}`);
      const ids = inputs.map((i) => i.id);
      t.expect(ids.every(Boolean) && new Set(ids).size === ids.length, `Every input needs its own id, they are: ${ids.map((id) => `"${id}"`).join(', ')}`);
      for (const [input, label] of [[inputs[0], 'Name'], [inputs[1], 'Email']] as const) {
        const labels = [...(input.labels ?? [])];
        t.expect(
          labels.length === 1 && labels[0].textContent?.includes(label),
          `The "${label}" input should have exactly one label "${label}", it has ${labels.length}`,
        );
      }
    },
  },
  {
    id: 'hint-described',
    run: async (t) => {
      const view = await t.render(<TextField label="City" hint="Where you live." />);
      const input = view.$('input');
      t.expect(input.hasAttribute('aria-describedby'), 'The input should have aria-describedby pointing to the hint');
      t.expect(description(input).includes('Where you live.'), `aria-describedby should point to the hint, it points to "${description(input)}"`);
    },
  },
  {
    id: 'error-invalid',
    run: async (t) => {
      const ok = (await t.render(<TextField label="Phone" hint="Digits only." />)).$('input');
      t.expect(ok.getAttribute('aria-invalid') !== 'true', 'Without an error the input should not be aria-invalid');

      const input = (await t.render(<TextField label="Phone" hint="Digits only." error="That is not a number." />)).$('input');
      t.expect(input.getAttribute('aria-invalid') === 'true', 'With an error the input needs aria-invalid="true"');
      const text = description(input);
      t.expect(
        text.includes('That is not a number.') && text.includes('Digits only.'),
        `aria-describedby should point to the hint and the error, it points to "${text}"`,
      );
    },
  },
];
