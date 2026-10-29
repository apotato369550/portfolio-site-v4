import SkillVisual from './SkillVisual';
import { skillsData } from '../data/content';

export default function Skills() {
  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="skills-grid">
        {skillsData.map((group, index) => (
          <div key={group.id} className={`skill-group fade-in${index % 2 ? ' skill-group--reverse' : ''}`}>
            <div className="skill-content">
            <h3>{group.title}</h3>
            <p className="skill-desc" dangerouslySetInnerHTML={{ __html: group.body }} />
            <p className="skill-tags">{group.tags.join(' · ')}</p>
            {group.note && <p className="personal-note">{group.note}</p>}
            </div>
            <SkillVisual group={group} />
          </div>
        ))}
      </div>
    </section>
  );
}
