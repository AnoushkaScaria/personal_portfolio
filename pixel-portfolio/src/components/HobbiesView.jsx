import { useState } from "react";
import HarpGame from "./HarpGame";

export default function HobbiesView({ folder, onExit }) {
  const [tab, setTab] = useState("photos");

  return (
    <div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "photos"}
          className={"tab" + (tab === "photos" ? " on" : "")} onClick={() => setTab("photos")}>
          Photos
        </button>
        <button role="tab" aria-selected={tab === "game"}
          className={"tab" + (tab === "game" ? " on" : "")} onClick={() => setTab("game")}>
          Name that tune
        </button>
      </div>

      {tab === "photos" ? (
        <div>
          <p className="hobby-intro">
            I play the harp! Here’s some memories from the past few years. Try the game to hear me play.
          </p>
          <div className="photos">
            {folder.photos.map((p, i) => (
              <figure className="polaroid" key={i}>
                <img src={p.src} alt={p.alt} loading="lazy" />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : (
        <HarpGame pieces={folder.pieces} onExit={onExit} />
      )}
    </div>
  );
}