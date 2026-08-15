import { dateRange, contactList, hasArr, Bullets, EmptyDocGuide } from "./helpers.jsx";

export default function TechTemplate({ data }) {
  const p = data.personal || {};
  const contacts = contactList(p);

  const isDocEmpty =
    !p.summary &&
    !hasArr(data.experience) &&
    !hasArr(data.projects) &&
    !hasArr(data.education) &&
    !hasArr(data.skills);

  return (
    <div className="resume-doc tpl-tech">
      <header className="rd-header">
        <div className="rd-header-main">
          <h1 className="rd-name">{p.fullName || "Your Name"}</h1>
          {p.jobTitle && <div className="rd-title">{p.jobTitle}</div>}
        </div>
        {contacts.length > 0 && (
          <div className="rd-contact">
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
              <h2 className="rd-section-title">Technical Overview</h2>
              <p>{p.summary}</p>
            </section>
          )}

          {hasArr(data.skills) && (
            <section className="rd-section">
              <h2 className="rd-section-title">Core Technical Skills</h2>
              <div className="rd-skills">
                {data.skills.map((s, i) => (
                  <span className="rd-skill" key={i}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {hasArr(data.experience) && (
            <section className="rd-section">
              <h2 className="rd-section-title">Professional Experience</h2>
              {data.experience.map((e, i) => (
                <div className="rd-item" key={i}>
                  <div className="rd-item-head">
                    <span className="rd-role">
                      {e.role || "Role"} {e.company && <span className="rd-org">@ {e.company}</span>}
                    </span>
                    <span className="rd-meta">{dateRange(e.startDate, e.endDate, e.current)}</span>
                  </div>
                  {e.location && <div className="rd-meta">{e.location}</div>}
                  <Bullets items={e.bullets} />
                </div>
              ))}
            </section>
          )}

          {hasArr(data.projects) && (
            <section className="rd-section">
              <h2 className="rd-section-title">Key Engineering Projects</h2>
              {data.projects.map((pr, i) => (
                <div className="rd-item" key={i}>
                  <div className="rd-item-head">
                    <span className="rd-role">{pr.name || "Project"}</span>
                    {hasArr(pr.tech) && <span className="rd-meta">{pr.tech.join(", ")}</span>}
                  </div>
                  {pr.description && <p>{pr.description}</p>}
                  {pr.link && <div className="rd-meta">Repository / Link: {pr.link}</div>}
                </div>
              ))}
            </section>
          )}

          {hasArr(data.education) && (
            <section className="rd-section">
              <h2 className="rd-section-title">Education & Credentials</h2>
              {data.education.map((e, i) => (
                <div className="rd-item" key={i}>
                  <div className="rd-item-head">
                    <span className="rd-role">
                      {e.degree || "Degree"}
                      {e.field ? `, ${e.field}` : ""}
                    </span>
                    <span className="rd-meta">{dateRange(e.startDate, e.endDate)}</span>
                  </div>
                  <div className="rd-org">
                    {e.school}
                    {e.grade ? ` · ${e.grade}` : ""}
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
