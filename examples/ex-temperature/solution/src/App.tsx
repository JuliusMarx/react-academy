import { useState } from 'react';
import { convert, toCelsius, toFahrenheit } from './convert';

type Scale = 'c' | 'f';

type TemperatureInputProps = {
  scale: Scale;
  value: string;
  onChange: (value: string) => void;
};

function TemperatureInput({ scale, value, onChange }: TemperatureInputProps) {
  return (
    <p>
      <label>
        {scale === 'c' ? 'Celsius' : 'Fahrenheit'}{' '}
        <input id={scale === 'c' ? 'celsius' : 'fahrenheit'} value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </p>
  );
}

function BoilingVerdict({ celsius }: { celsius: number }) {
  return <p id="verdict">{celsius >= 100 ? 'Water would boil.' : 'Water would not boil.'}</p>;
}

export default function App() {
  // One source of truth: the value the user typed last, and in which scale.
  const [temperature, setTemperature] = useState({ value: '', scale: 'c' as Scale });

  const celsius = temperature.scale === 'c' ? temperature.value : convert(temperature.value, toCelsius);
  const fahrenheit = temperature.scale === 'f' ? temperature.value : convert(temperature.value, toFahrenheit);

  return (
    <main>
      <h1>Temperature</h1>
      <TemperatureInput scale="c" value={celsius} onChange={(value) => setTemperature({ value, scale: 'c' })} />
      <TemperatureInput scale="f" value={fahrenheit} onChange={(value) => setTemperature({ value, scale: 'f' })} />
      <BoilingVerdict celsius={parseFloat(celsius) || 0} />
    </main>
  );
}
