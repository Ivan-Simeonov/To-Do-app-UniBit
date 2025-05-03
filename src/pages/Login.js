import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5001/users?username=${credentials.username}&password=${credentials.password}`);
      const data = await res.json();

      if (data.length > 0) {
        // User found
        localStorage.setItem('user', JSON.stringify(data[0]));
        alert('Login successful!');
        navigate('/dashboard');
      } else {
        alert('Invalid username or password.');
      }
    } catch (err) {
      console.error(err);
      alert('Error logging in.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <br />
        <input 
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
