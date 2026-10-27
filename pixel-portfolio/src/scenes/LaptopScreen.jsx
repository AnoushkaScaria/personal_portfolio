import content from "../content/content.json";
import DesktopIcon from "../components/DesktopIcon";

export default function LaptopScreen() {
  return (
    <div className="stage">
      <div className="laptop">
        <div className="lid">
          <div className="screen">
            <div className="icons">
              {content.folders.map((f) => (
                <DesktopIcon
                  key={f.id}
                  label={f.label}
                  color={f.color}
                  onOpen={() => console.log("open", f.id)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="base" />
      </div>
    </div>
  );
}