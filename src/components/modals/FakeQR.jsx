function FakeQR() {
  const grid = Array.from({ length: 49 }, () => Math.random() > 0.45);
  return (
    <div className="pix-qr-inner">
      {grid.map((filled, i) => (
        <div
          key={i}
          className="pix-qr-cell"
          style={{
            opacity:              filled ? 1 : 0.08,
            animationDelay:       `${i * 0.015}s`,
            animationFillMode:    'forwards',
          }}
        />
      ))}
    </div>
  );
}

export default FakeQR;
