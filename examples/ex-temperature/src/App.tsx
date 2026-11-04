import { useState } from 'react';
import { convert, toCelsius, toFahrenheit } from './convert';

type Scale = 'c' | 'f';

// TODO 1: TemperatureInput keeps its own state – so the two inputs don't know about each other.
//         Move the state up into App and pass value + onChange down as props.
function TemperatureInput({ scale }: { scale: Scale }) {
  const [value, setValue] = useState('');
  return (
    <p>
      <label>
        {scale === 'c' ? 'Celsius' : 'Fahrenheit'}{' '}
        <input id={scale === 'c' ? 'celsius' : 'fahrenheit'} value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
    </p>
  );
}

function BoilingVerdict({ celsius }: { celsius: number }) {
  return <p id="verdict">{celsius >= 100 ? 'Water would boil.' : 'Water would not boil.'}</p>;
}

export default function App() {
  // TODO 2: store the last edited value and its scale here. The other input shows the converted
  //         value: convert(value, toFahrenheit) or convert(value, toCelsius).
  // TODO 3: pass the temperature in Celsius to BoilingVerdict.
  void convert;
  void toCelsius;
  void toFahrenheit;

  return (
    <main>
      <h1>Temperature</h1>
      <TemperatureInput scale="c" />
      <TemperatureInput scale="f" />
      <BoilingVerdict celsius={0} />
    </main>
  );
}
