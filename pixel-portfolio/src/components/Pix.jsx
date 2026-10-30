// src/components/Pix.jsx
export default function Pix({ rows, palette, size = 56 }) {
  const rects = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (palette[ch]) {
        rects.push(
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[ch]} />
        );
      }
    });
  });

  return (
  <svg
    viewBox={`0 0 ${rows[0].length} ${rows.length}`}
    width={size}
    height={(size * rows.length) / rows[0].length}
    shapeRendering="crispEdges"
    aria-hidden="true"
  >
      {rects}
    </svg>
  );
}