type Status = 'success' | 'error';

const colors: Record<Status, string> = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
};

export default function Badge({ status, children }: { status: Status; children: string }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${colors[status]}`}>{children}</span>;
}
