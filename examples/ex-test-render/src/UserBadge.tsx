// The component under test – you don't need to change it.
export default function UserBadge({ name, role = 'Member' }: { name: string; role?: string }) {
  return (
    <div className="badge">
      <strong>{name}</strong> <span>{role}</span>
    </div>
  );
}
