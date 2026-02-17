import { experienceData } from '../data/content';
import evotech from '../assets/evotech.jpeg';
import gdgoc from '../assets/gdgoc.png';
import dostStart from '../assets/dost_start.jpg';

const logoMap = {
  'evotech.jpeg': evotech,
  'gdgoc.png': gdgoc,
  'dost_start.jpg': dostStart,
};

export default function Experience() {
  return (
    <section id="experience">
      <h2>Experience</h2>
      {experienceData.map((item, i) => (
        <div key={i} className="exp-entry fade-in">
          <div className="exp-header">
            <div className="exp-title-block">
              {item.logo === 'cbvt' ? (
                <div className="exp-logo-initials">CBVT</div>
              ) : item.logo && logoMap[item.logo] ? (
                <img src={logoMap[item.logo]} alt={item.org} className="exp-logo" />
              ) : null}
              <div>
                <strong className="exp-title">{item.title}</strong>
                <span className="exp-org">{item.org}</span>
              </div>
            </div>
            <span className="exp-date">{item.date}</span>
          </div>
          <p className="exp-body" dangerouslySetInnerHTML={{ __html: item.body }} />
          {item.note && <p className="personal-note">{item.note}</p>}
        </div>
      ))}
    </section>
  );
}
