const GROUND = 78; // y where the buildings meet the water

const TONES = {
  sunset: { far: "#6a3b8f", near: "#2b1d57", bridge: "#e0452b", water: "#4a2f86", glow: "#ffd27a", sun: true },
  dusk:   { far: "#2a2260", near: "#15123a", bridge: "#9a3a30", water: "#1b1848", glow: "#ffd27a", sun: false },
};

// [x, width, height]: tweak these to reshape the skyline
const FAR = [
  [0, 14, 22], [12, 10, 30], [22, 12, 18], [34, 9, 26], [43, 14, 34], [56, 10, 20],
  [240, 12, 28], [252, 10, 36], [262, 14, 22], [276, 10, 30], [286, 12, 40], [298, 10, 24], [308, 12, 32],
];
const NEAR = [
  [0, 18, 38], [16, 12, 48], [28, 16, 34], [44, 10, 42],
  [250, 14, 44], [262, 12, 34], [272, 16, 52], [288, 12, 40], [300, 20, 46],
];

let key = 0;
const r = (x, y, w, h, fill, opacity) => (
  <rect key={key++} x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />
);

function build(t) {
  const out = [];

  // sun: drawn row by row, with gaps in the lower half for the retro stripes
  if (t.sun) {
    const cx = 160, cy = 52, rad = 20;
    for (let y = cy - rad; y <= cy + rad; y++) {
      if (y >= 58 && y % 6 < 2) continue;
      const half = Math.round(Math.sqrt(rad * rad - (y - cy) * (y - cy)));
      out.push(r(cx - half, y, half * 2, 1, y < cy ? "#ffd27a" : "#ffa05a"));
    }
  }

  // far buildings
  FAR.forEach(([x, w, h]) => out.push(r(x, GROUND - h, w, h, t.far)));

  // water, plus the sun's reflection
  out.push(r(0, GROUND, 320, 22, t.water));
  if (t.sun) {
    [80, 83, 86, 89, 92].forEach((y, i) =>
      out.push(r(160 - (14 - i * 2), y, (14 - i * 2) * 2, 1, "#ffa05a", 0.8))
    );
  }

  // Golden Gate Bridge
  const deck = 69;
  out.push(r(62, deck, 176, 2, t.bridge));

  const tower = (cx) => {
    out.push(r(cx - 3, 34, 2, 46, t.bridge)); // left leg
    out.push(r(cx + 1, 34, 2, 46, t.bridge)); // right leg
    [40, 50, 60].forEach((y) => out.push(r(cx - 3, y, 6, 2, t.bridge))); // cross beams
    out.push(r(cx - 4, 32, 8, 2, t.bridge)); // cap
  };
  tower(95);
  tower(205);

  // main cable sags between the towers, with suspenders hanging down
  for (let x = 95; x <= 205; x++) {
    const tt = (x - 150) / 55;
    const y = Math.round(62 - 28 * tt * tt);
    out.push(r(x, y, 1, 1, t.bridge));
    if (x % 5 === 0) out.push(r(x, y + 1, 1, deck - y - 1, t.bridge, 0.8));
  }
  // side spans, mirrored left and right
  for (let x = 62; x < 95; x++) {
    const y = Math.round(34 + (95 - x) * 1.06);
    out.push(r(x, y, 1, 1, t.bridge), r(300 - x, y, 1, 1, t.bridge));
    if (x % 5 === 0) {
      out.push(r(x, y + 1, 1, deck - y - 1, t.bridge, 0.8));
      out.push(r(300 - x, y + 1, 1, deck - y - 1, t.bridge, 0.8));
    }
  }

  // near buildings in front, with lit windows
  NEAR.forEach(([x, w, h]) => {
    out.push(r(x, GROUND - h, w, h, t.near));
    for (let wy = GROUND - h + 3; wy < GROUND - 3; wy += 5)
      for (let wx = x + 2; wx + 2 <= x + w - 1; wx += 4)
        if ((wx * 7 + wy * 3) % 5 < 2) out.push(r(wx, wy, 2, 2, t.glow));
  });

  return out;
}

export default function Skyline({ tone = "sunset" }) {
  return (
    <div className="skyline-wrap" aria-hidden="true">
      <svg className="skyline" viewBox="0 0 320 100" shapeRendering="crispEdges">
        {build(TONES[tone])}
      </svg>
    </div>
  );
}