import React from 'react';

const ProjectCard = ({ title, description, image, link, onView }) => {
  return (
    <div className="project-card" onClick={onView}>
      <img src={image} alt={title} className="project-image" />
      <div className="project-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={link} className="project-link" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
          View Project
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
