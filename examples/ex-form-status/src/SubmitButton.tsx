// TODO: read the status of the surrounding form with useFormStatus() (from 'react-dom').
//   While pending, the button is disabled and reads "Saving <title> …",
//   where <title> is the "title" field of the submitted form data (data.get('title')).
//   Otherwise it shows its children.
export default function SubmitButton({ children }: { children: string }) {
  return <button type="submit">{children}</button>;
}
