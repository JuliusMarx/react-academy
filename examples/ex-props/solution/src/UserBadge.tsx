type UserBadgeProps = {
  name: string;
  role?: string;
};

export default function UserBadge({ name, role = 'Member' }: UserBadgeProps) {
  return (
    <div className="badge">
      <strong>{name}</strong> <span className="role">{role}</span>
    </div>
  );
}
