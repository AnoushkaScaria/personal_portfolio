import Pix from "./Pix";
import { CLOUD_BIG, CLOUD_SMALL } from "./shapes";

// dusky colors for the character select sky
const LILAC = { a: "#b9a6f0", b: "#7c5fc4" };
const PINK  = { a: "#e9a2c8", b: "#b4619f" };
const BLUE  = { a: "#8fa6e8", b: "#5a6fc0" };

const ITEMS = [
  { art: CLOUD_BIG,   pal: LILAC, size: 150, style: { top: "8%",  left: "5%" },   dur: "28s" },
  { art: CLOUD_SMALL, pal: PINK,  size: 80,  style: { top: "14%", right: "12%" }, dur: "22s" },
  { art: CLOUD_BIG,   pal: BLUE,  size: 130, style: { top: "30%", right: "3%" },  dur: "34s" },
  { art: CLOUD_SMALL, pal: LILAC, size: 70,  style: { top: "40%", left: "8%" },   dur: "24s" },
];

export default function Decor() {
  return (
    <div className="decor" aria-hidden="true">
      {ITEMS.map((it, i) => (
        <span key={i} className="drift" style={{ animationDuration: it.dur, ...it.style }}>
          <Pix rows={it.art} palette={it.pal} size={it.size} />
        </span>
      ))}
    </div>
  );
}