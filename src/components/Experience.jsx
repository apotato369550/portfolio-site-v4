import { experienceData } from '../data/content';

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      {experienceData.map((item, i) =>
        item.minor ? (
          <div key={i} className="card card--minor fade-in">
            <p dangerouslySetInnerHTML={{ __html: item.body }} />
          </div>
        ) : (
          <div key={i} className="card fade-in">
            <div className="card-header">
              <div>
                <strong className="card-title">{item.title}</strong>
                <span className="card-org">{item.org}</span>
              </div>
              <span className="card-date">{item.date}</span>
            </div>
            <p className="card-body" dangerouslySetInnerHTML={{ __html: item.body }} />
          </div>
        )
      )}
    </section>
  );
}
