import { useState, useRef, useEffect, useMemo } from "react";
import Pix from "./Pix";
import { HARP } from "./shapes";

// where the harps float in the sky (shuffled each round)
const SPOTS = [
  { left: "5%", top: "10%" }, { left: "70%", top: "6%" }, { left: "38%", top: "36%" },
  { left: "10%", top: "60%" }, { left: "72%", top: "58%" },
];
const COLORS = ["#e0a458", "#ff8fa3", "#7fe0c0", "#a58cff", "#ffd166"];

// stand-in tunes, used only if an mp3 is missing
const MELODIES = [
  [261.63, 329.63, 392, 523.25, 392, 329.63],
  [392, 392, 440, 392, 523.25, 493.88],
  [293.66, 349.23, 440, 349.23, 293.66, 220],
  [329.63, 392, 329.63, 440, 392, 329.63],
  [523.25, 440, 392, 329.63, 293.66, 261.63],
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function HarpGame({ pieces, onExit }) {
  const [phase, setPhase] = useState("intro"); // intro | play | won | lost
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null); // harp being listened to
  const [matched, setMatched] = useState([]);
  const [hint, setHint] = useState("");

  // new random layout and name order every round
  const spots = useMemo(() => shuffle(SPOTS), [round]);
  const order = useMemo(() => shuffle(pieces.map((_, i) => i)), [round, pieces]);

  const audioRef = useRef(null);
  const ctxRef = useRef(null);

  const stopSound = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (ctxRef.current) { ctxRef.current.close().catch(() => {}); ctxRef.current = null; }
  };
  useEffect(() => stopSound, []); // stop music if the window closes

  const synth = (i) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      MELODIES[i % MELODIES.length].forEach((f, k) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + k * 0.45;
        o.type = "triangle"; o.frequency.value = f;
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.3);
      });
    } catch (e) {}
  };

  const playSound = (i) => {
    stopSound();
    const a = new Audio(pieces[i].file);
    audioRef.current = a;
    a.onerror = () => { if (audioRef.current === a) synth(i); };
    a.play().catch(() => {});
  };

  const start = () => {
    stopSound();
    setRound((r) => r + 1);
    setMatched([]);
    setSelected(null);
    setHint("");
    setPhase("play");
  };

  const pickHarp = (i) => {
    if (matched.includes(i)) return;
    setSelected(i);
    setHint("");
    playSound(i);
  };

  const pickName = (i) => {
    if (selected === null) { setHint("Click a harp first and listen."); return; }
    stopSound();
    if (i === selected) {
      const next = [...matched, i];
      setMatched(next);
      setSelected(null);
      if (next.length === pieces.length) setPhase("won");
    } else {
      setPhase("lost");
    }
  };

  if (phase === "intro")
    return (
      <div className="game-card">
        <h3 className="big">Name that tune</h3>
        <p>Click a harp to hear a piece I play, then click its name. Get one wrong and it’s game over.</p>
        <button className="btn" onClick={start}>Start</button>
      </div>
    );

  if (phase === "won")
    return (
      <div className="game-card">
        <h3 className="big">+200 points!</h3>
        <p>You matched all {pieces.length}. You have a good ear.</p>
        <div className="game-buttons">
          <button className="btn" onClick={start}>Play again</button>
          <button className="btn" onClick={onExit}>Exit</button>
        </div>
      </div>
    );

  if (phase === "lost")
    return (
      <div className="game-card">
        <h3 className="big">Wrong note!</h3>
        <p>You matched {matched.length} of {pieces.length}. Want another try?</p>
        <div className="game-buttons">
          <button className="btn" onClick={start}>Restart</button>
          <button className="btn" onClick={onExit}>Exit</button>
        </div>
      </div>
    );

  return (
    <div className="game">
      <div className="arena">
        {pieces.map((_, i) => (
          <button
            key={i}
            className={"harp-btn" + (selected === i ? " on" : "") + (matched.includes(i) ? " done" : "")}
            style={spots[i]}
            onClick={() => pickHarp(i)}
            aria-label={`Harp ${i + 1}: play the clip`}
          >
            {selected === i && <i className="note" aria-hidden="true">♪</i>}
            <Pix rows={HARP} palette={{ b: COLORS[i % COLORS.length], s: "#fff3d6" }} size={100} />
            {matched.includes(i) && <span className="check" aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>

      <p className="game-status" role="status">
        {hint || (selected === null ? "Pick a harp to hear a piece." : "Which piece is this?")}
        {" "}({matched.length}/{pieces.length})
      </p>

      <div className="chips">
        {order.map((i) => (
          <button key={i} className={"chip" + (matched.includes(i) ? " done" : "")}
            disabled={matched.includes(i)} onClick={() => pickName(i)}>
            {pieces[i].title}
          </button>
        ))}
      </div>
    </div>
  );
}