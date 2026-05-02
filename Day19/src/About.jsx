import React, { useState } from 'react';

const About = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="about" className="about-section">
      <h2>About Me</h2>
      <div className="about-card">
        <p>
          Hello! I'm Anamika, a passionate learner and aspiring frontend developer from Nepal. 
          Currently, I am on an exciting "111 Days of Code" journey to master React and modern web development.
        </p>
        
        {showMore && (
          <div className="more-info">
            <p>
              I believe in writing clean, maintainable code and designing intuitive user interfaces. 
              My goal is to build applications that not only look beautiful but also provide seamless 
              user experiences. When I'm not coding, I enjoy exploring new design trends and reading about tech!
            </p>
          </div>
        )}
        
        <button 
          className="toggle-text-btn" 
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </section>
  );
};

export default About;
