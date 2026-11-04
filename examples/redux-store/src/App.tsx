import { Provider } from 'react-redux';
import { amountAdded, decremented, incremented } from './counterSlice';
import { store, useAppDispatch, useAppSelector } from './store';

function Counter() {
  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <h2>Count: {value}</h2>
      <button onClick={() => dispatch(decremented())}>−</button>
      <button onClick={() => dispatch(incremented())}>+</button>
      <button onClick={() => dispatch(amountAdded(10))}>+10</button>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <h1>Redux Toolkit</h1>
      <Counter />
      <p>Install the Redux DevTools browser extension to see every action and state change.</p>
    </Provider>
  );
}
