import Pix from "./Pix";
import { FLOWER, SPARKLE, HEART, CLOUD } from "./decor";

const pink = { p: "#ff8fa3", y: "#ffd166", g: "#7fe0c0" };
const lilac = { p: "#a58cff", y: "#fff3d6", g: "#7fe0c0" };

const ITEMS = [
  // sparkles twinkle in the sky
  { art: SPARKLE, pal: { a: "#fff3d6" }, size: 24, cls: "twinkle", style: { top: "8%", left: "12%" } },
  { art: SPARKLE, pal: { a: "#ffd166" }, size: 18, cls: "twinkle d2", style: { top: "20%", right: "10%" } },
  { art: SPARKLE, pal: { a: "#fff3d6" }, size: 14, cls: "twinkle d3", style: { top: "45%", left: "4%" } },
  // clouds drift
  { art: CLOUD, pal: { a: "#e8c9f0" }, size: 90, cls: "drift", style: { top: "12%", left: "55%" } },
  { art: HEART, pal: { a: "#ff8fa3" }, size: 22, cls: "bob", style: { top: "60%", right: "6%" } },
  // a little garden along the bottom
  { art: FLOWER, pal: pink, size: 54, style: { bottom: 0, left: "3%" } },
  { art: FLOWER, pal: lilac, size: 40, style: { bottom: 0, left: "11%" } },
  { art: FLOWER, pal: pink, size: 48, style: { bottom: 0, right: "14%" } },
  { art: FLOWER, pal: lilac, size: 60, style: { bottom: 0, right: "3%" } },
];

export default function Decor() {
  return (
    <div className="decor" aria-hidden="true">
      {ITEMS.map((it, i) => (
        <span key={i} className={it.cls} style={it.style}>
          <Pix rows={it.art} palette={it.pal} size={it.size} />
        </span>
      ))}
    </div>
  );
}