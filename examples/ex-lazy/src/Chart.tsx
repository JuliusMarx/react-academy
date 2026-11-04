// A "heavy" component – it should only be loaded when the user wants to see it.
export default function Chart() {
  const values = [3, 7, 4, 9, 6];
  return (
    <figure id="chart">
      <svg width={200} height={100} role="img" aria-label="Sales chart">
        {values.map((v, i) => (
          <rect key={i} x={i * 40 + 5} y={100 - v * 10} width={30} height={v * 10} fill="#087ea4" />
        ))}
      </svg>
      <figcaption>Sales per month</figcaption>
    </figure>
  );
}
