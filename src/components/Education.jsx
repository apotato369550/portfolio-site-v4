import { educationData } from '../data/content';
import philnitsLogo from '../assets/Philnitslogo.png';
import uscLogo from '../assets/usc.png';

export default function Education() {
  return (
    <section id="education">
      <h2>Education</h2>
      {educationData.map((entry, i) => (
        <div key={i} className="education-milestone">
          <div className="education-milestone-card">
          <div className="entry-top">
            <div className="education-entry-top">
              <div className="education-logo-tile"><img src={entry.institution.includes('PhilNITS') ? philnitsLogo : uscLogo} alt={entry.institution} className={`edu-logo${entry.institution.includes('PhilNITS') ? ' edu-logo--philnits' : ''}`} /></div>
              <div className="education-heading"><h3>{entry.degree}</h3><span className="entry-sub">{entry.institution}</span></div>
            </div>
            <span className="card-date">{entry.date}</span>
          </div>
          <ul className="entry-list">
            {entry.items.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
          </div>
        </div>
      ))}
    </section>
  );
}
