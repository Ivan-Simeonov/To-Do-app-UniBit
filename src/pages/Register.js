import { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Password strength check
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordValid.test(formData.password)) {
      alert(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      //Check if username already exists
      const checkRes = await fetch(
        `http://localhost:5001/users?username=${formData.username}`
      );
      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        alert('Username already exists. Please choose another.');
        return;
      }

      //Create new user
      const newUser = {
        ...formData,
        id: Date.now(),
      };

      const res = await fetch('http://localhost:5001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert('User registered successfully!');
        setFormData({ username: '', password: '', role: 'user' });
      } else {
        alert('Registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error during registration.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="leader">Team Leader</option>
        </select>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
