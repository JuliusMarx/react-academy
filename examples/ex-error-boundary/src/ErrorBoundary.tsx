import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

// TODO 1: catch render errors of the children: add static getDerivedStateFromError(error)
//         that returns { error }.
// TODO 2: when there is an error, render instead of the children:
//         <div role="alert"><p>Something went wrong: {message}</p><button>Try again</button></div>
// TODO 3: "Try again" resets the error, so the children are rendered again.
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  render() {
    return this.props.children;
  }
}
