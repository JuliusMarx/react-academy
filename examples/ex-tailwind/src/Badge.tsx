type Status = 'success' | 'error';

// TODO: style the badge with Tailwind utility classes:
//   - always: inline-flex rounded-full px-3 py-1 text-sm font-medium
//   - "success": bg-green-100 text-green-800
//   - "error":   bg-red-100 text-red-800
export default function Badge({ status, children }: { status: Status; children: string }) {
  void status;
  return <span>{children}</span>;
}
