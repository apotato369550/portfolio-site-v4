import { educationData } from '../data/content';
import uscLogo from '../assets/usc.png';

export default function Education() {
  return (
    <section id="education">
      <h2>Education</h2>
      {educationData.map((entry, i) => (
        <div key={i} className="entry fade-in">
          <div className="entry-top">
            {i === 0 && (
              <div className="education-entry-top">
                <img src={uscLogo} alt="University of San Carlos" className="edu-logo" />
                <div>
                  <strong className="entry-title">{entry.institution}</strong>
                  <em className="entry-sub">{entry.degree}</em>
                </div>
              </div>
            )}
            {i !== 0 && (
              <div className="education-entry-top">
                <img src={uscLogo} alt="University of San Carlos" className="edu-logo" />
                <div>
                  <strong className="entry-title">{entry.institution}</strong>
                  <em className="entry-sub">{entry.degree}</em>
                </div>
              </div>
            )}
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
