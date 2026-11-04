type UserBadgeProps = {
  name: string;
  role?: string;
};

// TODO 1: use the props – show the name in <strong> and the role in <span className="role">.
// TODO 2: if no role is passed, show "Member".
export default function UserBadge(props: UserBadgeProps) {
  void props;
  return (
    <div className="badge">
      <strong>Name</strong> <span className="role">Role</span>
    </div>
  );
}
