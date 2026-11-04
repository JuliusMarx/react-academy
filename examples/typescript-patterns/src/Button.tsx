import type { ComponentProps } from 'react';

type Variant = 'primary' | 'danger';

// All props of a native <button>, plus our own "variant".
type ButtonProps = ComponentProps<'button'> & { variant?: Variant };

export default function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const colors = variant === 'danger' ? { background: '#b3261e', borderColor: '#b3261e' } : {};
  return <button {...rest} style={colors} className={['btn', className].filter(Boolean).join(' ')} />;
}
