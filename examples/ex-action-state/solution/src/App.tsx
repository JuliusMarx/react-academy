import { useActionState } from 'react';
import { postComment } from './api';

type State = { comments: string[]; error: string | null };

const initialState: State = { comments: ['First!'], error: null };

async function addComment(previousState: State, formData: FormData): Promise<State> {
  const text = String(formData.get('text')).trim();
  if (text.length < 3) return { ...previousState, error: 'Comment is too short' };
  const saved = await postComment(text);
  return { comments: [...previousState.comments, saved], error: null };
}

export default function App() {
  const [state, formAction, isPending] = useActionState(addComment, initialState);

  return (
    <main>
      <h1>Comments</h1>
      <ul id="comments">
        {state.comments.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
      <form action={formAction}>
        <label>
          Comment <input id="text" name="text" />
        </label>{' '}
        <button type="submit" disabled={isPending}>
          {isPending ? 'Posting …' : 'Post'}
        </button>
      </form>
      {state.error && <p id="error">{state.error}</p>}
    </main>
  );
}
