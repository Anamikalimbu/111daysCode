import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import About from './About';
import Skills from './Skills';
import ProjectList from './ProjectList';
import Contact from './Contact';
import './index.css';

const App = () => {
  // GLOBAL STATE
  const [theme, setTheme] = useState('dark');
  const [projectsViewed, setProjectsViewed] = useState(0);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // STATE HANDLERS
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleProjectView = () => {
    setProjectsViewed(prev => prev + 1);
  };

  // PROPS DATA
  const heroData = {
    name: "Anamika Limbu",
    role: "Frontend Developer | Learner",
    introText: "Passionate about creating modern, beautiful, and responsive web applications. Currently embarking on a 111 Days of Code journey."
  };

  const mySkills = [
    "HTML5", "CSS3", "JavaScript (ES6+)", "React.js", 
    "Python", "Tailwind CSS", "Git & GitHub", "Figma"
  ];

  const myProjects = [
    {
      id: 1,
      title: "E-Commerce Dashboard",
      description: "A responsive admin dashboard built with React and Chart.js for data visualization.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 2,
      title: "Weather App",
      description: "A real-time weather application using the OpenWeather API and modern CSS glassmorphism.",
      image: "https://images.unsplash.com/photo-1504608524841-42ce6c20b0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    },
    {
      id: 3,
      title: "Task Management Tool",
      description: "A drag-and-drop to-do list app utilizing local storage and custom React hooks.",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      link: "#"
    }
  ];

  return (
    <div className="app-wrapper">
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        projectsViewed={projectsViewed} 
      />
      
      <main className="main-content">
        <HeroSection 
          name={heroData.name} 
          role={heroData.role} 
          introText={heroData.introText} 
        />
        
        <About />
        
        <Skills skills={mySkills} />
        
        <ProjectList 
          projects={myProjects} 
          onProjectView={handleProjectView} 
        />
        
        <Contact />
      </main>
    </div>
  );
};

export default App;
