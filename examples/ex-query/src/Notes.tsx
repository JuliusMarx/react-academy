import { useEffect, useState } from 'react';
import { addNote, fetchNotes, type Note } from './api';

// TODO 1: replace useState + useEffect with useQuery({ queryKey: ['notes'], queryFn: fetchNotes }).
//         While pending, show <p id="loading">Loading …</p>.
// TODO 2: save new notes with useMutation({ mutationFn: addNote, onSuccess: … }) and
//         invalidate the ['notes'] query on success, so the list is fetched again.
export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchNotes().then(setNotes);
  }, []);

  return (
    <>
      <ul id="notes">
        {notes.map((n) => (
          <li key={n.id}>{n.text}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNote(text); // saved on the server – but the list doesn't know
          setText('');
        }}
      >
        <label>
          Note <input id="text" value={text} onChange={(e) => setText(e.target.value)} />
        </label>{' '}
        <button type="submit">Add</button>
      </form>
    </>
  );
}
