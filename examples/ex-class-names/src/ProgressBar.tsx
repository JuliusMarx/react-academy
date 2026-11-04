// TODO 3: set the width of .bar with an inline style: width = percent %, but never more than 100 % or less than 0 %
export default function ProgressBar({ percent }: { percent: number }) {
  void percent;
  return (
    <div className="track">
      <div className="bar" />
    </div>
  );
}
