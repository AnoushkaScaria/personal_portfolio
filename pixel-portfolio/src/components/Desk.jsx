import Pix from "./Pix";
import { LAMP, BOOKS, MUG, SUCCULENT } from "./shapes";
        
const PLANT = { g: "#5fbf8f", d: "#2f7d62", p: "#d9795b", q: "#b85c43" };

// left/right = position, w = width, drop = how far toward the front of the desk
const ITEMS = [
    { art: LAMP, pal: { b: "#ffd166", a: "#5a4a7a" }, w: "clamp(40px, 4.6vw, 66px)", style: { left: "3%" }, glow: true },  { art: BOOKS,     pal: { p: "#ff8fa3", m: "#7fe0c0", l: "#a58cff", k: "#2b1f4a" }, w: "clamp(100px, 11vw, 160px)", style: { left: "11%", "--drop": "8px" } },
    { art: MUG,       pal: { m: "#fff3d6", w: "#6b3f2a" }, w: "clamp(44px, 5vw, 72px)", style: { right: "15%", "--drop": "8px" }, steam: true },
    { art: SUCCULENT, pal: PLANT, w: "clamp(70px, 8vw, 116px)", style: { right: "3.5%" } },
];

export default function Desk() {
  return (
    <>
      <div className="desk" aria-hidden="true">
        <div className="desk-top" />
        <div className="desk-front" />
      </div>
      <div className="desk-decor" aria-hidden="true">
        {ITEMS.map((it, i) => (
          <span key={i} style={{ width: it.w, ...it.style }}>
            {it.glow && <i className="glow" />}
            {it.steam && <i className="steam" />}
            <Pix rows={it.art} palette={it.pal} size={100} />
          </span>
        ))}
      </div>
    </>
  );
}