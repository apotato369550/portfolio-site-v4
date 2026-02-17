import { featuredProject, projectsData } from '../data/content';
import MapReduceDiagram from './MapReduceDiagram';

export default function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="project-grid">

        {/* Featured — spans full width with inline diagram */}
        <div className="card project-card project-card--featured fade-in">
          <div className="card-header">
            <strong className="project-title">{featuredProject.title}</strong>
            <span className="card-date">{featuredProject.date}</span>
          </div>
          <p className="project-label">{featuredProject.label}</p>
          <div className="featured-inner">
            <div className="featured-body">
              <p
                className="card-body"
                dangerouslySetInnerHTML={{ __html: featuredProject.body }}
              />
              <div className="tags">
                {featuredProject.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            <MapReduceDiagram />
          </div>
        </div>

        {/* 2-col grid */}
        {projectsData.map((project, i) => (
          <div key={i} className="card project-card fade-in">
            <div className="card-header">
              <strong className="project-title">{project.title}</strong>
              <span className="card-date">{project.date}</span>
            </div>
            <p className="project-label">{project.label}</p>
            <p className="card-body" dangerouslySetInnerHTML={{ __html: project.body }} />
            <div className="tags">
              {project.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
