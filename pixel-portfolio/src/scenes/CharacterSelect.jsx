import content from "../content/content.json";

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

  return (
    <div className="arcade">
      <h2 className="select-title">Select your character</h2>

      <div className="select-layout">
        <div className="slots">
          {/* The only playable character: you */}
          <div className="slot active">
            <div className="portrait">you</div>
            <span>{p.name}</span>
          </div>
          {/* Locked slots */}
          {[2, 3].map((n) => (
            <div className="slot locked" key={n} aria-label="Locked">
              <div className="portrait">???</div>
              <span>Player {n}: not found</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>{p.name}</h3>
          <p className="meta">Class: {p.class}</p>
          <p className="meta">Level {p.level} · Special move: {p.special}</p>
          <p>{p.bio}</p>
          {p.stats.map((s) => (
            <StatBar key={s.label} {...s} />
          ))}
          <button className="btn" onClick={onSelect}>Select</button>
        </div>
      </div>

      <button className="skip" onClick={onSkip}>Skip to desktop</button>
    </div>
  );
}