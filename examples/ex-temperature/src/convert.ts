export const toCelsius = (fahrenheit: number) => ((fahrenheit - 32) * 5) / 9;
export const toFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;

/** Converts a typed value with the given function, e.g. convert('100', toFahrenheit) → '212'. Invalid input → ''. */
export function convert(value: string, fn: (n: number) => number): string {
  const input = parseFloat(value);
  if (Number.isNaN(input)) return '';
  return String(Math.round(fn(input) * 1000) / 1000);
}
