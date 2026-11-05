import { useId, type ComponentProps } from 'react';

type Props = ComponentProps<'input'> & {
  label: string;
  hint?: string;
  error?: string;
};

export default function TextField({ label, hint, error, ...props }: Props) {
  // One id per instance, the related ids derived from it
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={describedBy} aria-invalid={error ? true : undefined} {...props} />
      {hint && (
        <p id={hintId} className="hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="error">
          {error}
        </p>
      )}
    </div>
  );
}
