import type { ComponentProps } from 'react';

type Props = ComponentProps<'input'> & {
  label: string;
  hint?: string;
  error?: string;
};

// TODO 1: generate the ids with useId – a fixed "field" breaks as soon as the component is used twice.
// TODO 2: link the hint to the input with aria-describedby.
// TODO 3: with an error, mark the input with aria-invalid and add the error to aria-describedby, too.
export default function TextField({ label, hint, error, ...props }: Props) {
  return (
    <div className="field">
      <label htmlFor="field">{label}</label>
      <input id="field" {...props} />
      {hint && <p className="hint">{hint}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
