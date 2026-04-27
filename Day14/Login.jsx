import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic...
    console.log('Logged in successfully!');
    alert('Logged in successfully! Redirecting to Home...');
    
    // Redirect to the home page programmatically
    navigate('/');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin} style={{ padding: '10px', fontSize: '16px' }}>
        Log In
      </button>
    </div>
  );
}

export default Login;
