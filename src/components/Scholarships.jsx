import { scholarshipsData } from '../data/content';
import dostSei from '../assets/dost_sei.png';
import datacamp from '../assets/datacamp.jpg';

const logoMap = {
  'dost_sei.png': dostSei,
  'datacamp.jpg': datacamp,
};

export default function Scholarships() {
  return (
    <section id="scholarships">
      <h2>Scholarships</h2>
      <div className="scholarships-grid">
        {scholarshipsData.map((item, i) => (
          <div key={i} className="scholarship-entry fade-in">
            <img src={logoMap[item.logo]} alt={item.org} className="scholarship-logo" />
            <div className="scholarship-body">
              <strong className="entry-title">{item.name}</strong>
              <span className="entry-sub">{item.org} · {item.date}</span>
              <p>{item.body}</p>
              {item.note && <p className="personal-note">{item.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
