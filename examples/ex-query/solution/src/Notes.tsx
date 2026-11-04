import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addNote, fetchNotes } from './api';

export default function Notes() {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');

  const { data: notes, isPending } = useQuery({ queryKey: ['notes'], queryFn: fetchNotes });

  const mutation = useMutation({
    mutationFn: addNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  });

  if (isPending) return <p id="loading">Loading …</p>;

  return (
    <>
      <ul id="notes">
        {notes?.map((n) => (
          <li key={n.id}>{n.text}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(text);
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
