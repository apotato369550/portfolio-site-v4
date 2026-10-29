import { skillsData } from '../data/content';

export default function Skills() {
  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="skills-grid">
        {skillsData.map((group, i) => (
          <div key={i} className="skill-group fade-in">
            <h3>{group.title}</h3>
            <p className="skill-desc" dangerouslySetInnerHTML={{ __html: group.body }} />
            {group.icons && (
              <div className="skill-icons">
                {group.icons.map((cls, j) => (
                  <i key={j} className={cls} title={cls.split('-')[1]} />
                ))}
              </div>
            )}
            <p className="skill-tags">{group.tags.join(' · ')}</p>
            {group.note && <p className="personal-note">{group.note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
