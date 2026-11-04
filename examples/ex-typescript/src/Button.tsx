// TODO 1: accept all props of a native <button> plus "variant": ComponentProps<'button'> & { variant?: … }
// TODO 2: pass every other prop on to the <button> (type, disabled, onClick, aria-label, …)
// TODO 3: the class is "btn btn-primary" or "btn btn-danger" (default: primary)
export default function Button({ children }: { children: string }) {
  return <button className="btn">{children}</button>;
}
