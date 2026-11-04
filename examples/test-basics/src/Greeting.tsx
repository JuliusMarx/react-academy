export default function Greeting({ name, unread = 0 }: { name: string; unread?: number }) {
  return (
    <section>
      <h2>Hello, {name}!</h2>
      {unread > 0 ? <p>You have {unread} new messages.</p> : <p>No new messages.</p>}
      <button>Open inbox</button>
    </section>
  );
}
