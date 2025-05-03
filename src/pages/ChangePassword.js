import { useState, useEffect } from 'react';

function ChangePassword() {
  const [formData, setFormData] = useState({
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const pending = JSON.parse(localStorage.getItem('pendingUser'));
    if (pending) {
      setFormData((prev) => ({
        ...prev,
        username: pending.username,
        oldPassword: pending.password,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, oldPassword, newPassword, confirmPassword } = formData;

    // ✅ Check if new passwords match
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    // ✅ Password strength validation
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordValid.test(newPassword)) {
      alert(
        'New password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      // ✅ Verify old password
      const res = await fetch(
        `http://localhost:5001/users?username=${username}&password=${oldPassword}`
      );
      const users = await res.json();

      if (users.length === 0) {
        alert('Incorrect username or old password.');
        return;
      }

      const user = users[0];
      const updatedUser = { ...user, password: newPassword };

      const updateRes = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (updateRes.ok) {
        alert('Password updated successfully.');
        localStorage.removeItem('pendingUser');
        setFormData({
          username: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        alert('Failed to update password.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating password.');
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
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
          name="oldPassword"
          placeholder="Old Password"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;
