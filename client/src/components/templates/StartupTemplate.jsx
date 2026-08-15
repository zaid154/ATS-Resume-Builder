import { dateRange, contactList, hasArr, Bullets, EmptyDocGuide } from "./helpers.jsx";

export default function StartupTemplate({ data }) {
  const p = data.personal || {};
  const contacts = contactList(p);

  const isDocEmpty =
    !p.summary &&
    !hasArr(data.experience) &&
    !hasArr(data.projects) &&
    !hasArr(data.education) &&
    !hasArr(data.skills);

  return (
    <div className="resume-doc tpl-startup">
      <header className="rd-header">
        <h1 className="rd-name">{p.fullName || "Your Name"}</h1>
        {p.jobTitle && <div className="rd-title">{p.jobTitle}</div>}
        {contacts.length > 0 && (
          <div className="rd-contact" style={{ marginTop: 8 }}>
            {contacts.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        )}
      </header>

      {isDocEmpty ? (
        <EmptyDocGuide />
      ) : (
        <>
          {p.summary && (
            <section className="rd-section">
              <h2 className="rd-section-title">Value Proposition</h2>
              <p>{p.summary}</p>
            </section>
          )}

          {hasArr(data.experience) && (
            <section className="rd-section">
              <h2 className="rd-section-title">Impact & Track Record</h2>
              {data.experience.map((e, i) => (
                <div className="rd-item" key={i}>
                  <div className="rd-item-head">
                    <span className="rd-role">
                      {e.role || "Role"} {e.company && <span className="rd-org">@ {e.company}</span>}
                    </span>
                    <span className="rd-meta">{dateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  <Bullets items={e.bullets} />
                </div>
              ))}
            </section>
          )}

          {hasArr(data.projects) && (
            <section className="rd-section">
              <h2 className="rd-section-title">Products & Initiatives</h2>
              {data.projects.map((pr, i) => (
                <div className="rd-item" key={i}>
                  <span className="rd-role">{pr.name || "Project"}</span>
                  {pr.description && <p>{pr.description}</p>}
                </div>
              ))}
            </section>
          )}

          {hasArr(data.skills) && (
            <section className="rd-section">
              <h2 className="rd-section-title">Core Stack</h2>
              <div className="rd-skills">
                {data.skills.map((s, i) => (
                  <span className="rd-skill" key={i}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
