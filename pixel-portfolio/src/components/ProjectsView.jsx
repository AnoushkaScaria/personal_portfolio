const COLORS = ["#ff8fa3", "#7fe0c0", "#a58cff", "#ffd166"];

export default function ProjectsView({ folder }) {
  return (
    <div className="projects">
      {folder.items.map((p, i) => (
        <article className="cart" key={i}>
          <div className="cart-shot" style={{ background: COLORS[i % COLORS.length] }}>
            {p.image ? (
              <img src={p.image} alt={`Screenshot of ${p.title}`} loading="lazy" />
            ) : (
              <span aria-hidden="true">{p.title[0]}</span>
            )}
          </div>

          <div className="cart-body">
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            {p.role && <p className="cart-role"><b>My role:</b> {p.role}</p>}

            <div className="cart-tags">
              {p.tags.map((t) => <span key={t}>{t}</span>)}
            </div>

            {p.note && <p className="cart-note">{p.note}</p>}

            {p.links && p.links.length > 0 && (
              <div className="cart-links">
                {p.links.map((l) => (
                  <a key={l.label} className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}