
## 1. React Components

Components are the fundamental building blocks of a React application. They let you split the UI into independent, reusable pieces, and think about each piece in isolation.

### Functional Components

The most common way to define a component is to write a JavaScript function.

```jsx
import React from 'react';

// A simple functional component
function Greeting() {
  return (
    <div>
      <h1>Hello, welcome to React!</h1>
    </div>
  );
}

export default Greeting;
```

*   **PascalCase**: Component names should always start with a capital letter (e.g., `Greeting`, not `greeting`).
*   **Return JSX**: A component must return JSX (the HTML-like syntax inside the return statement).

## 2. React Props (Properties)

Props are arguments passed into React components. They are how components talk to each other. Think of props like arguments to a function.

### Passing and Accessing Props

You pass props to components like HTML attributes.

```jsx
// ParentComponent.jsx
import Greeting from './Greeting';

function App() {
  return (
    <div>
      {/* Passing a prop named 'name' with the value 'Alice' */}
      <Greeting name="Alice" age={25} />
      <Greeting name="Bob" age={30} />
    </div>
  );
}
```

```jsx
// Greeting.jsx
// Accessing props via the 'props' object
function Greeting(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>You are {props.age} years old.</p>
    </div>
  );
}
```

### Destructuring Props

A cleaner way to access props is by destructuring them directly in the function parameters.

```jsx
// Greeting.jsx (Destructured)
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}
```

**Important:** Props are **read-only**. A component must never modify its own props.

---

## 3. React Router

In a Single Page Application (SPA) like React, the page doesn't actually reload when you click a link. Instead, React Router intercepts the URL change and renders the appropriate component.

### Installation

To use React Router in your Vite or CRA project, you need to install it:

```bash
npm install react-router-dom
```

### Core Concepts

#### A. Setup (`BrowserRouter`)
You must wrap your entire application inside a `BrowserRouter` to enable routing.

```jsx
// main.jsx or index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

#### B. Defining Routes (`Routes` and `Route`)
Use the `Routes` component to group all your routes, and `Route` to map a URL path to a specific component.

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';

function App() {
  return (
    <Routes>
      {/* If the URL is '/', render the Home component */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<h1>404: Page Not Found</h1>} />
    </Routes>
  );
}
```

#### C. Navigation (`Link` and `NavLink`)
Do **not** use regular `<a href="...">` tags, as they will cause a full page reload. Instead, use `Link` or `NavLink`.

```jsx
// Navbar.jsx
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      {/* Basic Link */}
      <Link to="/">Home</Link>
      
      {/* NavLink allows styling based on active state */}
      <NavLink 
        to="/about" 
        style={({ isActive }) => ({ color: isActive ? 'red' : 'blue' })}
      >
        About
      </NavLink>
    </nav>
  );
}
```

#### D. Dynamic Routes and URL Parameters (`useParams`)
You can create routes that match a pattern, like `/users/:id`.

```jsx
// App.jsx
<Route path="/users/:userId" element={<UserProfile />} />
```

Inside the component, use the `useParams` hook to get the dynamic value:

```jsx
// UserProfile.jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  // 'userId' must match the parameter name defined in the Route path
  const { userId } = useParams();

  return <h1>Showing details for User ID: {userId}</h1>;
}
```

#### E. Programmatic Navigation (`useNavigate`)
Sometimes you need to navigate the user via code (e.g., after submitting a form). Use the `useNavigate` hook.

```jsx
// Login.jsx
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic...
    console.log('Logged in successfully!');
    
    // Redirect to the home page
    navigate('/');
  };

  return <button onClick={handleLogin}>Log In</button>;
}
```