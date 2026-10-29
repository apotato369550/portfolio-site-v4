import { featuredProject, projectsData } from '../data/content';
import ProjectVisual from './ProjectVisual';

export default function Projects() {
  const allProjects = [featuredProject, ...projectsData];

  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="project-grid">
        {allProjects.map((project, i) => {
          return (
            <div key={i} className="project-entry fade-in">
              <div className={`project-inner${i % 2 !== 0 ? ' project-inner--reverse' : ''}`}>
                <div className="project-inner-body">
                  <div className="project-header">
                    <strong className="project-title">{project.href ? <a href={project.href}>{project.title}</a> : project.title}</strong>
                    <span className="project-meta">{project.label} · {project.date}</span>
                  </div>
                  <p className="project-body" dangerouslySetInnerHTML={{ __html: project.body }} />
                  <div className="project-tags">
                    {project.tags.map((tag, j) => (
                      <span key={j} className="tag">{tag}</span>
                    ))}
                  </div>
                  {project.note && <p className="personal-note">{project.note}</p>}
                </div>
                <ProjectVisual title={project.title} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
