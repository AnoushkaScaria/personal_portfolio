import { useRef } from "react";

export default function Window({ win, onClose, onMinimize, onMaximize, onFocus, onMove, children }) {
  const drag = useRef(null);

const start = (e) => {
  onFocus();
  if (win.max) return;
  // if it hasn't been dragged yet, read where CSS actually put it
  const el = e.currentTarget.parentElement;
  const x = win.x ?? el.offsetLeft;
  const y = win.y ?? el.offsetTop;
  drag.current = { dx: e.clientX - x, dy: e.clientY - y };
  e.currentTarget.setPointerCapture(e.pointerId);
};
  const move = (e) => {
    if (!drag.current) return;
    onMove(Math.max(0, e.clientX - drag.current.dx), Math.max(0, e.clientY - drag.current.dy));
  };
  const end = () => (drag.current = null);

  return (
    <section
      className={"mac-win" + (win.max ? " max" : "")}
      style={
  win.x == null
    ? { top: 16 + win.offset, right: 16 + win.offset, zIndex: win.z }
    : { left: win.x, top: win.y, right: "auto", zIndex: win.z }
}
      onPointerDown={onFocus}
      aria-label={win.label}
      hidden={win.min}
    >
      <header className="titlebar" onPointerDown={start} onPointerMove={move} onPointerUp={end}>
        {/* stopPropagation so clicking a dot doesn't start a drag */}
        <div className="dots" onPointerDown={(e) => e.stopPropagation()}>
          <button className="dot red" onClick={onClose} aria-label={`Close ${win.label}`} />
          <button className="dot yellow" onClick={onMinimize} aria-label={`Minimize ${win.label}`} />
          <button className="dot green" onClick={onMaximize} aria-label={`Maximize ${win.label}`} />
        </div>
        <span className="win-title">{win.label}</span>
      </header>
      <div className="win-body">{children}</div>
    </section>
  );
}