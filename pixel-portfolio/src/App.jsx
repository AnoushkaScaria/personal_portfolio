import { useState } from "react";
import TitleScreen from "./scenes/TitleScreen";
import CharacterSelect from "./scenes/CharacterSelect";
import LaptopScreen from "./scenes/LaptopScreen";

export default function App() {
  // 'title' | 'select' | 'desktop'  (we'll add 'walk' next)
  const [scene, setScene] = useState("title");

  return (
    <div
      className="app-shell"
      onPointerMove={(event) => {
        event.currentTarget.style.setProperty("--pointer-x", `${event.clientX}px`);
        event.currentTarget.style.setProperty("--pointer-y", `${event.clientY}px`);
      }}
    >
      {scene === "title" ? (
        <TitleScreen onStart={() => setScene("select")} onSkip={() => setScene("desktop")} />
      ) : scene === "select" ? (
        <CharacterSelect onSelect={() => setScene("desktop")} onSkip={() => setScene("desktop")} />
      ) : (
        <LaptopScreen />
      )}
      <div className="cursor-highlight" aria-hidden="true" />
    </div>
  );
}