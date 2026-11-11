import { useEffect, useRef } from "react";

const W = 240, H = 135; // lower numbers = chunkier pixels

// c = cream fur, p = pink ear, e = eye
const PAL = { c: "#e6cfa3", p: "#c98f8a", e: "#1b2420" };

const LEAP = [
  ".........cc.c.",
  ".........cpcc.",
  "....cccccccccc",
  "..ccccccccccec",
  ".ccccccccccccc",
  "cccccccccccc..",
  ".cc.cccccc.ccc",
  ".c......c.c...",
];

const SIT = [
  "..c..c..",
  "..cp.cp.",
  "..c..c..",
  ".cccccc.",
  ".ccccec.",
  "cccccccc",
  "cccccccc",
  ".cccccc.",
  "cccccccc",
];

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

function rng(seed) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

function draw(ctx) {
  const rand = rng(8);
  const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

  // ---- background: dark green with a very faint dither, like paper grain ----
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const b = BAYER[y % 4][x % 4] / 16;
      const lift = (x / W) * 0.25 + (y / H) * 0.1; // slightly lighter toward bottom right
      px(x, y, 1, 1, b < lift ? "#1d2a24" : "#17211d");
    }
  }

  // ---- stars: small gold specks, and a few little plus shapes ----
  for (let i = 0; i < 34; i++) px(ri(2, W - 3), ri(2, H - 3), 1, 1, rand() < 0.5 ? "#b8863f" : "#d9a85a");
  for (let i = 0; i < 9; i++) {
    const x = ri(8, W - 9), y = ri(6, H - 40);
    px(x, y, 1, 1, "#e3b668");
    px(x - 1, y, 1, 1, "#9c6f33"); px(x + 1, y, 1, 1, "#9c6f33");
    px(x, y - 1, 1, 1, "#9c6f33"); px(x, y + 1, 1, 1, "#9c6f33");
  }

  // ---- draw a bunny from a grid, scaled, optionally flipped ----
  const bunny = (rows, ox, oy, s, flip) => {
    const w = rows[0].length;
    // soft shadow under the feet
    px(ox + 2 * s, oy + rows.length * s, (w - 4) * s, 1, "#0f1814");
    rows.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (PAL[ch]) px(ox + (flip ? w - 1 - x : x) * s, oy + y * s, s, s, PAL[ch]);
      })
    );
  };

  // a line of hoppers along the bottom, on a gentle wave
  [[14, 100, false], [64, 88, false], [114, 98, true], [160, 86, false]].forEach(([x, y, f]) =>
    bunny(LEAP, x, y, 2, f)
  );

  // one sitting at the end, with a few stars above it
  bunny(SIT, 206, 104, 2, true);
  px(214, 90, 1, 1, "#e3b668"); px(224, 84, 1, 1, "#d9a85a"); px(204, 80, 1, 1, "#d9a85a");

  // stars trailing behind the hoppers
  [[40, 112], [92, 108], [140, 116], [186, 108], [56, 124], [150, 126]].forEach(([x, y]) =>
    px(x, y, 1, 1, "#d9a85a")
  );
}

export default function BunnySky() {
  const ref = useRef(null);
  useEffect(() => {
    draw(ref.current.getContext("2d"));
  }, []);
  return <canvas ref={ref} width={W} height={H} className="pixel-sky" aria-hidden="true" />;
}