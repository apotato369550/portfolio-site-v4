import { skillsData } from '../data/content';

export default function Skills() {
  return (
    <section id="skills">
      <h2>Skills</h2>
      <div className="skills-grid fade-in">
        {skillsData.map((group, i) => (
          <div key={i} className="skill-group">
            <h3>{group.label}</h3>
            <p>{group.skills}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
