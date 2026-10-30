import { useState } from "react";
import content from "../content/content.json";
import Pix from "../components/Pix";
import Decor from "../components/Decor.jsx";
import { PLAYER, PLAYER_PALETTE } from "../components/character";

function StatBar({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <span className="blocks" aria-label={`${value} out of 10`}>
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} className={i < value ? "on" : ""} />
        ))}
      </span>
    </div>
  );
}

export default function CharacterSelect({ onSelect, onSkip }) {
  const p = content.player;
  const [selected, setSelected] = useState(false);

  return (
    <div className="arcade">
      <Decor />
      <h2 className="select-title">Select your character</h2>

      <div className="select-layout">
        <div className="slots">
          {/* Playable character: a button so it works with mouse, touch, and keyboard */}
          <button
            className={"slot active" + (selected ? " picked" : "")}
            onClick={() => setSelected(true)}
            aria-pressed={selected}
          >
            <div className="portrait">
              <Pix rows={PLAYER} palette={PLAYER_PALETTE} size={100} />
            </div>
            <span>{p.name}</span>
          </button>

          {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div className="slot locked" key={n} aria-label="Locked">
              <div className="portrait">???</div>
              <span>Player {n}: not found</span>
            </div>
          ))}
        </div>

        <div className="card">
          {!selected ? (
            <p className="hint">Choose a character to see their stats.</p>
          ) : (
            <>
              <h3>{p.name}</h3>
              <p className="meta">Class: {p.class}</p>
              <p className="meta">Level {p.level} · Special move: {p.special}</p>
              <p>{p.bio}</p>
              {p.stats.map((s) => (
                <StatBar key={s.label} {...s} />
              ))}
              <button className="btn" onClick={onSelect}>Go</button>
              
              <p></p>

                <div className="speaker">
                <Pix rows={PLAYER} palette={PLAYER_PALETTE} size={100} />
                <p className="bubble" role="status">Good choice! Let’s go to my computer!</p>
                
              </div>
            </>
          )}
        </div>
      </div>

      <button className="skip" onClick={onSkip}>Skip to desktop</button>
    </div>
  );
}