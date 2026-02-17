import { affiliationsData } from '../data/content';
import gdgoc from '../assets/gdgoc.png';
import devcon from '../assets/devcon.png';
import innovare from '../assets/innovare.png';
import dostStart from '../assets/dost_start.jpg';
import dsu from '../assets/dsu.jpg';

const logoMap = {
  'gdgoc.png': gdgoc,
  'devcon.png': devcon,
  'innovare.png': innovare,
  'dost_start.jpg': dostStart,
  'dsu.jpg': dsu,
};

export default function Affiliations() {
  return (
    <section id="affiliations">
      <h2>Affiliations</h2>
      <div className="affiliations-grid">
        {affiliationsData.map((item, i) => (
          <div key={i} className="affil-entry fade-in">
            <img src={logoMap[item.logo]} alt={item.org} className="affil-logo" />
            <div className="affil-body">
              <strong className="affil-role">{item.role}</strong>
              <span className="affil-org">{item.org} · {item.date}</span>
              {item.note && <p className="personal-note">{item.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
