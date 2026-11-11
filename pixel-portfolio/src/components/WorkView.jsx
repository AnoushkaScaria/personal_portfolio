export default function WorkView({ folder }) {
  return (
    <div className="jobs">
      {folder.items.map((j, i) => (
        <article className="job" key={i}>
          <span className="job-dot" aria-hidden="true" />
          <p className="job-dates">{j.dates}</p>
          <h3>{j.role}</h3>
          <p className="job-company">{j.company} · {j.location}</p>

          <ul>
            {j.bullets.map((b, k) => <li key={k}>{b}</li>)}
          </ul>

          <div className="job-tags">
            {j.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
        </article>
      ))}
    </div>
  );
}