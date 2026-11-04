import { postComment } from './api';

type State = { comments: string[]; error: string | null };

const initialState: State = { comments: ['First!'], error: null };

// TODO 1: turn this into an action for useActionState: (previousState, formData) => next state.
//   - comment shorter than 3 characters → keep the comments, error "Comment is too short"
//   - otherwise await postComment(text) and add it to the comments, error null
async function addComment(previousState: State, formData: FormData): Promise<State> {
  void formData;
  return previousState;
}

// TODO 2: call useActionState(addComment, initialState) and use its state, action and isPending:
//   - <form action={…}>, the comments in <ul id="comments">, the error in <p id="error">
//   - while pending, the button is disabled and reads "Posting …"
export default function App() {
  const state = initialState;
  void addComment;

  return (
    <main>
      <h1>Comments</h1>
      <ul id="comments">
        {state.comments.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
      <form>
        <label>
          Comment <input id="text" name="text" />
        </label>{' '}
        <button type="submit">Post</button>
      </form>
    </main>
  );
}
