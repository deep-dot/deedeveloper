import React from 'react';
import './portfolio.css';

const Portfolio = ({ data }) => {
  const { projects } = data;

  const projectList = projects.map((project, index) => (
    <div key={index} className="portfolio-item">
      <a href={project.url} target="_blank" rel="noopener noreferrer">
        <img src={project.image} alt={project.title} />
      </a>
      <h3>{project.title}</h3>
      <p>{project.category}</p>
    </div>
  ));

  return (
    <section id="portfolio">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Portfolio</h2>
          </div>
        </div>
        <div className="row">
          {projectList}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
