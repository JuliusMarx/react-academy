export default function Avatar() {
  return (
    <span
      role="img"
      aria-label="Avatar"
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: 64,
        height: 64,
        marginRight: 8,
        borderRadius: '50%',
        background: '#087ea4',
        color: 'white',
        fontSize: 28,
      }}
    >
      🙂
    </span>
  );
}
