import Pix from "./Pix";

export default function LinkIcon({ label, url, art, palette }) {
  return (
    <a className="ico" href={url} target="_blank" rel="noopener noreferrer">
      <Pix rows={art} palette={palette} size={56} />
      <span>{label}</span>
    </a>
  );
}