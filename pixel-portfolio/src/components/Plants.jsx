import Pix from "./Pix";
import { SNAKE, SUCCULENT, VINE } from "./decor";

const pal = {
  g: "#5fbf8f", // leaf
  d: "#2f7d62", // dark leaf
  p: "#d9795b", // pot
  q: "#b85c43", // pot shade
};

const PLANTS = [
  { art: VINE, w: "clamp(40px, 6vw, 70px)", cls: "sway", style: { top: 0, right: "22%" } },
  { art: VINE, w: "clamp(32px, 5vw, 56px)", cls: "sway s2", style: { top: 0, right: "30%" } },
  { art: SNAKE, w: "clamp(70px, 14vw, 150px)", style: { bottom: 0, right: "4%" } },
  { art: SUCCULENT, w: "clamp(50px, 9vw, 100px)", style: { bottom: 0, right: "21%" } },
  { art: SUCCULENT, w: "clamp(40px, 7vw, 80px)", style: { bottom: 0, left: "6%" } },
];

export default function Plants() {
  return (
    <div className="plants" aria-hidden="true">
      {PLANTS.map((p, i) => (
        <span key={i} className={p.cls} style={{ width: p.w, ...p.style }}>
          <Pix rows={p.art} palette={pal} size={100} />
        </span>
      ))}
    </div>
  );
}