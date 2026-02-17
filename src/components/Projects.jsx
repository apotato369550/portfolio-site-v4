import { featuredProject, projectsData } from '../data/content';
import MapReduceDiagram from './MapReduceDiagram';
import AiYeastDiagram from './AiYeastDiagram';
import TimetablingDiagram from './TimetablingDiagram';
import AgentSuiteDiagram from './AgentSuiteDiagram';
import EnrollmateDiagram from './EnrollmateDiagram';
import KitchenDiagram from './KitchenDiagram';

const diagrams = {
  'Amazon Listing Analyzer API': MapReduceDiagram,
  'ai-yeast': AiYeastDiagram,
  'timetabling-algorithms': TimetablingDiagram,
  'jays-ai-agent-suite': AgentSuiteDiagram,
  'enrollmate': EnrollmateDiagram,
  'kitchen-management-system': KitchenDiagram,
};

export default function Projects() {
  const allProjects = [featuredProject, ...projectsData];

  return (
    <section id="projects">
      <h2>Projects</h2>
      <div className="project-grid">
        {allProjects.map((project, i) => {
          const Diagram = diagrams[project.title];
          return (
            <div key={i} className="project-entry fade-in">
              <div className={`project-inner${i % 2 !== 0 ? ' project-inner--reverse' : ''}`}>
                <div className="project-inner-body">
                  <div className="project-header">
                    <strong className="project-title">{project.title}</strong>
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
                {Diagram && (
                  <div className="diagram">
                    <Diagram />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
