import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'danger' };

export default function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button {...rest} className={`btn btn-${variant}`} />;
}
