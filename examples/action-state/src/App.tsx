import { useActionState } from 'react';

// "name" is returned so the form can show it again – React resets the fields after every action.
type State = { error: string | null; user: string | null; name: string };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The action gets the previous state and the form data – and returns the next state.
async function signUp(_prev: State, formData: FormData): Promise<State> {
  await wait(700);
  const name = String(formData.get('name')).trim();
  const password = String(formData.get('password'));
  if (name.length < 2) return { error: 'Name must have at least 2 characters.', user: null, name };
  if (password.length < 8) return { error: 'Password must have at least 8 characters.', user: null, name };
  return { error: null, user: name, name };
}

export default function App() {
  const [state, formAction, isPending] = useActionState(signUp, { error: null, user: null, name: '' });

  if (state.user) return <h1>Welcome, {state.user}! 🎉</h1>;

  return (
    <main>
      <h1>Sign up</h1>
      <form action={formAction}>
        <p>
          <label>
            Name <input name="name" defaultValue={state.name} />
          </label>
        </p>
        <p>
          <label>
            Password <input name="password" type="password" />
          </label>
        </p>
        {state.error && <p role="alert" style={{ color: 'crimson' }}>{state.error}</p>}
        <button type="submit" disabled={isPending}>
          {isPending ? 'Signing up …' : 'Sign up'}
        </button>
      </form>
    </main>
  );
}
