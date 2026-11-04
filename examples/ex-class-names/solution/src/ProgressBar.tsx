export default function ProgressBar({ percent }: { percent: number }) {
  const width = Math.min(100, Math.max(0, percent));
  return (
    <div className="track">
      <div className="bar" style={{ width: `${width}%` }} />
    </div>
  );
}
