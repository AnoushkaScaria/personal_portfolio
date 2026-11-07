import content from "../content/content.json";
import PixelSky from "../components/PixelSky";



export default function TitleScreen({ onStart, onSkip }) {
  return (
    <div className="arcade center sunset">
      <PixelSky />
      <h3 className="subtitle">Hi! My name is</h3>
      <h1 className="game-title">{content.player.name}</h1>
      <p className="subtitle">I'm a software engineer interested in full-stack and AI engineering.</p>
      <button className="btn" onClick={onStart}>Start</button>
      <button className="skip" onClick={onSkip}>Skip to desktop</button>
    </div>
  );
}