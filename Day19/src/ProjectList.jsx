import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onProjectView }) => {
  return (
    <section id="projects" className="projects-section">
      <h2>My Projects</h2>
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard 
            key={project.id}
            title={project.title}
            description={project.description}
            image={project.image}
            link={project.link}
            onView={onProjectView}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
