// src/components/DesktopIcon.jsx
import Pix from "./Pix";

const FOLDER = [
  "aaaaa.......",
  "abbbbaaaaaaa",
  "abccccccccca",
  "abccccccccca",
  "abccccccccca",
  "abccccccccca",
  "abccccccccca",
  "aaaaaaaaaaaa",
];

export default function DesktopIcon({ label, color, onOpen }) {
  return (
    <button className="ico" onClick={onOpen}>
      <Pix rows={FOLDER} palette={{ a: "#2b1f4a", b: "#fff3d6", c: color }} />
      <span>{label}</span>
    </button>
  );
}