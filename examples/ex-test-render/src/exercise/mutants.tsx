// Deliberately broken versions of UserBadge – your tests should notice each of them.
function HardcodedName({ role = 'Member' }: { name: string; role?: string }) {
  return (
    <div className="badge">
      <strong>Ada</strong> <span>{role}</span>
    </div>
  );
}

function NoDefaultRole({ name, role }: { name: string; role?: string }) {
  return (
    <div className="badge">
      <strong>{name}</strong> <span>{role}</span>
    </div>
  );
}

function IgnoresRole({ name }: { name: string; role?: string }) {
  return (
    <div className="badge">
      <strong>{name}</strong> <span>Member</span>
    </div>
  );
}

export const mutants = {
  HardcodedName: { UserBadge: HardcodedName },
  NoDefaultRole: { UserBadge: NoDefaultRole },
  IgnoresRole: { UserBadge: IgnoresRole },
};
