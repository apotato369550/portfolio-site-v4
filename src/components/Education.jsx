import { educationData } from '../data/content';

export default function Education() {
  return (
    <section id="education">
      <h2>Education</h2>
      {educationData.map((entry, i) => (
        <div key={i} className="entry fade-in">
          <div className="entry-top">
            <div>
              <strong className="entry-title">{entry.institution}</strong>
              <em className="entry-sub">{entry.degree}</em>
            </div>
            <span className="card-date">{entry.date}</span>
          </div>
          <ul className="entry-list">
            {entry.items.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
