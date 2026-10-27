import { useState } from "react";
import TitleScreen from "./scenes/TitleScreen";
import CharacterSelect from "./scenes/CharacterSelect";
import LaptopScreen from "./scenes/LaptopScreen";

export default function App() {
  // 'title' | 'select' | 'desktop'  (we'll add 'walk' next)
  const [scene, setScene] = useState("title");

  if (scene === "title")
    return <TitleScreen onStart={() => setScene("select")} onSkip={() => setScene("desktop")} />;
  if (scene === "select")
    return <CharacterSelect onSelect={() => setScene("desktop")} onSkip={() => setScene("desktop")} />;
  return <LaptopScreen />;
}