import { useRef } from 'react';
import { useBearStore } from './store';

function BearCounter() {
  // Select only what you need: this component re-renders only when "bears" changes.
  const bears = useBearStore((state) => state.bears);
  const renders = useRef(0);
  renders.current++;
  return (
    <p>
      🐻 {bears} bears <small>(rendered {renders.current}×)</small>
    </p>
  );
}

function FishCounter() {
  const fish = useBearStore((state) => state.fish);
  const renders = useRef(0);
  renders.current++;
  return (
    <p>
      🐟 {fish} fish <small>(rendered {renders.current}×)</small>
    </p>
  );
}

function Controls() {
  const addBear = useBearStore((state) => state.addBear);
  const addFish = useBearStore((state) => state.addFish);
  const reset = useBearStore((state) => state.reset);
  return (
    <p>
      <button onClick={addBear}>Add bear</button>
      <button onClick={() => addFish(5)}>Add 5 fish</button>
      <button onClick={reset}>Reset</button>
    </p>
  );
}

export default function App() {
  return (
    <main>
      <h1>Zustand</h1>
      <BearCounter />
      <FishCounter />
      <Controls />
      <p>No provider needed – any component can use the store.</p>
    </main>
  );
}
