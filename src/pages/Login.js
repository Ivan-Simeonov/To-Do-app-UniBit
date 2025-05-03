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
      const res = await fetch(
        `http://localhost:5001/users?username=${credentials.username}&password=${credentials.password}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const user = data[0];

        // Password strength check
        const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordValid.test(user.password)) {
          alert('Your password is outdated. Please register again with a stronger password.');
          navigate('/register');
          return;
        }

        localStorage.setItem('user', JSON.stringify(user));
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
