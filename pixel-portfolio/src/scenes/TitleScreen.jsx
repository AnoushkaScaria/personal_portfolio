import content from "../content/content.json";

export default function TitleScreen({ onStart, onSkip }) {
  return (
    <div className="arcade center">
      <h1 className="game-title">{content.player.name}</h1>
      <p className="subtitle">A portfolio adventure</p>
      <button className="btn" onClick={onStart}>Press start</button>
      <button className="skip" onClick={onSkip}>Skip to desktop</button>
    </div>
  );
}