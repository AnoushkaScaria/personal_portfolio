import { useEffect, useRef } from "react";

const W = 240, H = 135; // lower numbers = chunkier pixels

const SKY = ["#b866b0", "#c96fa6", "#dc7c9b", "#e88c90", "#ee9f88", "#f1b08a", "#f3c592", "#f6d89f"];
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

function rng(seed) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}
function makeNoise(seed) {
  const rand = rng(seed);
  const grid = Array.from({ length: 64 * 64 }, () => rand());
  const g = (x, y) => grid[(y & 63) * 64 + (x & 63)];
  const sm = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const fx = sm(x - xi), fy = sm(y - yi);
    const a = g(xi, yi), b = g(xi + 1, yi), c = g(xi, yi + 1), d = g(xi + 1, yi + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}

function draw(ctx) {
  const noise = makeNoise(7);
  const rand = rng(42);
  const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const line = (x0, y0, x1, y1, c) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++)
      px(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), 1, 1, c);
  };

  // ---- sky: dithered bands, streaky near the top ----
  const skyH = Math.floor(H * 0.7);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const b = BAYER[y % 4][x % 4] / 16;
      const t = Math.min(y / skyH, 1);
      const wob = noise(x * 0.05, y * 0.35) * 0.7 + noise(x * 0.12 + 20, y * 0.7) * 0.3;
      const tt = t + (wob - 0.5) * 0.28 * (1 - t * 0.6);
      const idx = Math.max(0, Math.min(SKY.length - 1, Math.floor((tt + (b - 0.5) / SKY.length) * SKY.length)));
      px(x, y, 1, 1, SKY[idx]);
    }
  }

  // ---- stars ----
  for (let i = 0; i < 45; i++) px(ri(0, W - 1), ri(2, Math.floor(H * 0.38)), 1, 1, "#fff0c0");

  // ---- faint sun behind the buildings ----
  const sx = Math.floor(W * 0.46), sy = Math.floor(H * 0.46);
  for (let y = -13; y <= 13; y++) {
    const half = Math.round(Math.sqrt(13 * 13 - y * y));
    px(sx - half, sy + y, half * 2, 1, "#f9e3ae");
  }

  // ---- a row of buildings ----
  const row = ({ color, base, w: [w0, w1], h: [h0, h1], win, prob, overlap = 1 }) => {
    let x = -4;
    while (x < W) {
      const w = ri(w0, w1), h = ri(h0, h1), top = base - h;
      px(x, top, w, h, color);
      if (rand() < 0.2) px(x + Math.floor(w / 2), top - 4, 1, 4, color);   // antenna
      if (rand() < 0.25) px(x + 2, top - 2, Math.max(2, w - 4), 2, color); // rooftop box
      if (win)
        for (let wy = top + 3; wy < base - 3; wy += 4)
          for (let wx = x + 2; wx + 1 < x + w - 1; wx += 3)
            if (rand() < prob) px(wx, wy, 1, 2, win);
      x += w - overlap;
    }
  };

  row({ color: "#e79a8a", base: Math.floor(H * 0.64), w: [9, 17], h: [20, 52], win: "#f8dca6", prob: 0.35 });

  // ---- bridge: a truss triangle, tucked between the far and middle rows ----
  const bc = "#d68a88", bBase = Math.floor(H * 0.6);
  line(50, bBase, 76, bBase - 30, bc);
  line(102, bBase, 76, bBase - 30, bc);
  for (let x = 54; x <= 98; x += 3) {
    const half = 26 - Math.abs(x - 76) * 0.0; // keep ribs inside the triangle
    const topY = bBase - Math.round(30 * (1 - Math.abs(x - 76) / half));
    line(x, bBase, x, Math.max(topY, bBase - 29), bc);
  }
  px(44, bBase, 70, 1, bc);

  row({ color: "#b26c7d", base: Math.floor(H * 0.69), w: [10, 19], h: [14, 38], win: "#f8dca6", prob: 0.4 });
  row({ color: "#7c5a7e", base: Math.floor(H * 0.73), w: [11, 21], h: [10, 26], win: "#f2c78d", prob: 0.3 });

  // ---- elevated highway ----
  const deck = Math.floor(H * 0.75);
  px(0, deck + 3, W, H - deck - 3, "#6a4a6c");                       // lit gap under the road
  row({ color: "#52405e", base: H, w: [8, 16], h: [14, 30], win: "#c49a8a", prob: 0.2 });
  px(0, deck, W, 3, "#3a2b44");                                       // road
  px(0, deck - 4, W, 1, "#3a2b44");                                   // rail
  for (let x = 0; x < W; x += 3) px(x, deck - 4, 1, 4, "#3a2b44");    // posts
  px(0, deck + 3, W, 3, "#2f2438");                                   // underside
  for (let x = 14; x < W; x += 62) px(x, deck + 6, 5, H - deck - 6, "#2f2438"); // pillars

  // ---- foreground silhouettes ----
  let fx = -6;
  while (fx < W) {
    const w = ri(22, 40), h = ri(18, 40);
    px(fx, H - h, w, h, "#221d2b");
    if (rand() < 0.35) px(fx + 3, H - h - 3, 4, 3, "#221d2b");

    // lit windows (a fixed pattern, so the skyline layout doesn't change)
    for (let wy = H - h + 4; wy < H - 4; wy += 6)
      for (let wx = fx + 3; wx + 2 <= fx + w - 3; wx += 5)
        if ((wx * 7 + wy * 13) % 5 < 2)
          px(wx, wy, 2, 2, (wx + wy) % 3 === 0 ? "#c49a8a" : "#f2c78d");

    fx += w + (rand() < 0.4 ? ri(2, 9) : -1);
  }

  // ---- street lamp ----
  px(W - 18, H - 36, 1, 36, "#221d2b");
  px(W - 22, H - 37, 9, 1, "#221d2b");
  px(W - 22, H - 36, 2, 2, "#fff0c0");
  px(W - 15, H - 36, 2, 2, "#fff0c0");
}

export default function PixelSky() {
  const ref = useRef(null);
  useEffect(() => {
    draw(ref.current.getContext("2d"));
  }, []);
  return <canvas ref={ref} width={W} height={H} className="pixel-sky" aria-hidden="true" />;
}