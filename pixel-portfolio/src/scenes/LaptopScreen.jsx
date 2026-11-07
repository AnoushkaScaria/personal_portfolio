import { useState, useRef } from "react";
import content from "../content/content.json";
import DesktopIcon from "../components/DesktopIcon";
import Window from "../components/Window";
import Plants from "../components/Plants";
import DuskSky from "../components/DuskSky";
import Desk from "../components/Desk";
import LinkIcon from "../components/LinkIcon";
import { GITHUB, LINKEDIN } from "../components/shapes";

function FolderView({ folder }) {
  return (
    <div>
      {folder.items.map((it, i) => (
        <div className="entry" key={i}>
          <h3>{it.title}</h3>
          <p>{it.text}</p>
          {it.tags.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LaptopScreen() {
  const [wins, setWins] = useState([]);
  const topZ = useRef(10);

  const update = (id, patch) =>
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const open = (folder) => {
    setWins((ws) => {
      // already open? bring it to the front and un-minimize it
      if (ws.some((w) => w.id === folder.id)) {
        return ws.map((w) =>
          w.id === folder.id ? { ...w, min: false, z: ++topZ.current } : w
        );
      }
      // otherwise open a new one, offset a little so they don't stack exactly
      return [
        ...ws,
        { id: folder.id, label: folder.label, x: 130 + ws.length * 30, y: 20 + ws.length * 30,
          z: ++topZ.current, min: false, max: false },
      ];
    });
  };

  const close = (id) => setWins((ws) => ws.filter((w) => w.id !== id));

  return (
    <div className="stage">
      <DuskSky mood="night" moon city/>
      <Desk />
      <div className="laptop">
        <div className="lid">
          <div className="screen">
<div className="icons">
  {content.folders.map((f) => (
    <DesktopIcon key={f.id} label={f.label} color={f.color} onOpen={() => open(f)} />
  ))}
</div>

<div className="links">
  <LinkIcon
    label="GitHub"
    url={content.links[0].url}
    art={GITHUB}
    palette={{ d: "#1b1f24", w: "#fff3d6" }}
  />
  <LinkIcon
    label="LinkedIn"
    url={content.links[1].url}
    art={LINKEDIN}
    palette={{ b: "#4a8fe0", w: "#ffffff" }}
  />
</div>

            {wins.map((w) => (
              <Window
                key={w.id}
                win={w}
                onClose={() => close(w.id)}
                onMinimize={() => update(w.id, { min: true })}
                onMaximize={() => update(w.id, { max: !w.max })}
                onFocus={() => update(w.id, { z: ++topZ.current })}
                onMove={(x, y) => update(w.id, { x, y })}
              >
                <FolderView folder={content.folders.find((f) => f.id === w.id)} />
              </Window>
            ))}

            {/* minimized windows wait here */}
            <div className="dock">
              {wins.filter((w) => w.min).map((w) => (
                <button key={w.id} onClick={() => update(w.id, { min: false, z: ++topZ.current })}>
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="base" />
      </div>
    </div>
  );
}