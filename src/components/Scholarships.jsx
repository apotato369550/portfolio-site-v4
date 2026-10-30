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
        {scholarshipsData.map((item) => (
          <div key={item.name} className="scholarship-entry">
            <article className="scholarship-card">
              <div className="scholarship-heading">
                <div className="scholarship-logo-tile">
                  <img src={logoMap[item.logo]} alt={item.org} className="scholarship-logo" />
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <span className="scholarship-issuer">{item.org}</span>
                  <span className="scholarship-date">{item.date}</span>
                </div>
              </div>
              <div className="scholarship-body">
                <p>{item.body}</p>
              </div>
              <div className="scholarship-details">
                <h4>{item.detailsTitle}</h4>
                <ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
              </div>
              {item.note && <p className="personal-note">{item.note}</p>}
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
