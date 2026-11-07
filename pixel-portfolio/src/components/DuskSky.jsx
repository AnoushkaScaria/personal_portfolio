import { useEffect, useRef } from "react";

const W = 240, H = 135; // lower numbers = chunkier pixels

// palettes run from the top of the sky to the horizon
const MOODS = {
  // sun just set: purple sky, warm coral glow, a few stars
  twilight: {
    palette: ["#2a2a78", "#3a3490", "#503d9e", "#6c46a6", "#8c50a8",
              "#b05aa6", "#d2689c", "#ec7f90", "#f79c84", "#fbba88"],
    glow: 3, stars: 45, twinkles: 4, power: 1.3,
  },
  // the dark one
  night: {
    palette: ["#121744", "#1a1f5c", "#252a74", "#35308a", "#4b3694",
              "#693e9c", "#8a4a9f", "#ae559c", "#d46a86", "#ee8c78"],
    glow: 2.5, stars: 90, twinkles: 7, power: 1.5,
  },
};
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

function draw(ctx, mood, { moon, city }) {
  const { palette: PALETTE, glow, stars, twinkles, power } = MOODS[mood];
  const N = PALETTE.length;
  const noise = makeNoise(11);
  const rand = rng(5);
  const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const b = BAYER[y % 4][x % 4] / 16;
      const t = y / H;

      // wobble the bands sideways so they form streaks, not stripes
      const wob = noise(x * 0.05, y * 0.35) * 0.7 + noise(x * 0.12 + 20, y * 0.7) * 0.3;
      const tt = Math.pow(Math.max(0, Math.min(1, t + (wob - 0.5) * 0.22)), power);
      let v = tt * N + (b - 0.5);

      // cloud streaks: darker ones across the sky, a few lit pink ones near the horizon
      const s = noise(x * 0.03 + 50, y * 0.5 + 9);
      if (t > 0.2 && t < 0.92) {
        if (s > 0.64) v -= 1.2;
        else if (t > 0.55 && s < 0.32) v += 1.0;
      }

      // last bit of glow right at the horizon
      const g = 1 - Math.hypot((x - W / 2) / (W * 0.65), (y - H) / (H * 0.4));
      if (g > 0) v += g * glow;

      px(x, y, 1, 1, PALETTE[Math.max(0, Math.min(N - 1, Math.floor(v)))]);
    }
  }

  // stars: lots up high, fewer lower down
  const starColors = ["#fff0c0", "#ffd0e4", "#c4d4ff"];
  for (let i = 0; i < stars; i++) {
    const y = Math.floor(Math.pow(rand(), 1.7) * H * 0.7);
    px(ri(0, W - 1), y, 1, 1, starColors[ri(0, 2)]);
  }
  // a few bigger twinkles
  for (let i = 0; i < twinkles; i++) {
    const x = ri(6, W - 7), y = ri(4, Math.floor(H * 0.4));
    px(x, y, 1, 1, "#fff6d6");
    px(x - 1, y, 1, 1, "#c9b8ff"); px(x + 1, y, 1, 1, "#c9b8ff");
    px(x, y - 1, 1, 1, "#c9b8ff"); px(x, y + 1, 1, 1, "#c9b8ff");
  }

  // ---- moon: dithered halo, pale disc, shaded edge, a few craters ----
  if (moon) {
    const mx = Math.floor(W * 0.88), my = Math.floor(H * 0.2), R = 9;
    for (let y = my - R - 9; y <= my + R + 9; y++) {
      for (let x = mx - R - 9; x <= mx + R + 9; x++) {
        const d = Math.hypot(x - mx, y - my);
        const b = BAYER[((y % 4) + 4) % 4][((x % 4) + 4) % 4] / 16;
        if (d > R && d < R + 9 && (1 - (d - R) / 9) * 0.55 > b) px(x, y, 1, 1, "#7a6ab8");
        if (d <= R) {
          const shade = Math.hypot(x - (mx - 3), y - (my - 2)) > R - 2;
          px(x, y, 1, 1, shade ? "#cfc59a" : "#f6efcf");
        }
      }
    }
    [[-3, -3, 2, 2], [2, 1, 3, 2], [-4, 3, 2, 1], [1, -5, 1, 1]].forEach(([dx, dy, w, h]) =>
      px(mx + dx, my + dy, w, h, "#ddd3ab")
    );
  }

  // ---- faint city: two layers that melt into the sky ----
  if (city) {
    const r2 = rng(21);
    const ri2 = (a, b) => a + Math.floor(r2() * (b - a + 1));
    [
        { color: "#34205a", base: Math.floor(H * 0.86), w: [9, 16], h: [14, 38], prob: 0.12 },
        { color: "#241545", base: Math.floor(H * 0.92), w: [10, 18], h: [8, 24], prob: 0.08 },
    ].forEach(({ color, base, w: [w0, w1], h: [h0, h1], prob }) => {
      let x = -4;
      while (x < W) {
        const w = ri2(w0, w1), h = ri2(h0, h1), top = base - h;
        px(x, top, w, H - top, color); // runs down behind the desk
        if (r2() < 0.2) px(x + Math.floor(w / 2), top - 4, 1, 4, color); // antenna
        for (let wy = top + 3; wy < base - 3; wy += 4)
          for (let wx = x + 2; wx + 1 < x + w - 1; wx += 3)
            if (r2() < prob) px(wx, wy, 1, 2, "#c79ac4");
        x += w - 1;
      }
    });
  }
}

export default function DuskSky({ mood = "twilight", moon = false, city = false }) {
  const ref = useRef(null);
  useEffect(() => {
    draw(ref.current.getContext("2d"), mood, { moon, city });
  }, [mood, moon, city]);
  return <canvas ref={ref} width={W} height={H} className="pixel-sky" aria-hidden="true" />;
}