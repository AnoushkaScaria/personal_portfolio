import Pix from "./Pix";
import { BADGE } from "./shapes";

const EARNED = { a: "#2b1f4a", o: "#ff9900", w: "#fff3d6" };
const PENDING = { a: "#2b1f4a", o: "#b8a9d9", w: "#efe8ff" };

export default function CertView({ folder }) {
  return (
    <div className="certs">
      {folder.items.map((c, i) => {
        const earned = c.status === "earned";
        return (
          <article className={"cert" + (earned ? "" : " pending")} key={i}>
            <div className="cert-badge">
              <Pix rows={BADGE} palette={earned ? EARNED : PENDING} size={100} />
            </div>

            <div className="cert-info">
              <h3>{c.title}</h3>
              <p className="cert-issuer">{c.issuer}</p>
              <p className="cert-meta">
                {earned
                  ? `Earned ${c.date}` + (c.expires ? ` · Valid through ${c.expires}` : "")
                  : "In progress"}
              </p>

              {c.skills && (
                <div className="cert-tags">
                  {c.skills.map((s) => <span key={s}>{s}</span>)}
                </div>
              )}

              {c.credentialId && <p className="cert-id">Credential ID: {c.credentialId}</p>}

              {earned && c.url && (
                <a className="btn" href={c.url} target="_blank" rel="noopener noreferrer">
                  Verify
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}