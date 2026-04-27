import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import UserProfile from './UserProfile';
import Login from './Login';
import Greeting from './Greeting';

function App() {
  return (
    <div>
      <Navbar />
      
      {/* Example of passing props */}
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '20px 0' }}>
        <h2>Props Example:</h2>
        <Greeting name="Alice" age={25} />
        <Greeting name="Bob" age={30} />
      </div>

      <hr />

      {/* Routing Example */}
      <h2>React Router Example:</h2>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
