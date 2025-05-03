import { useEffect, useState } from 'react';

function AdminView() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/users')
      .then(res => res.json())
      .then(data => {
        // Show only other users
        const filtered = data.filter(user => user.id !== currentUser.id);
        setUsers(filtered);
      });
  }, [currentUser]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    try {
      const res = await fetch(`http://localhost:5001/tasks?userId=${user.id}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  return (
    <div>
      <h2>Team Leader View</h2>
      <h3>Team Members</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <button onClick={() => handleUserClick(user)}>
              {user.username}
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3>Tasks for {selectedUser.username}</h3>
          <ul>
            {tasks.length === 0 ? (
              <p>No tasks found.</p>
            ) : (
              tasks.map(task => (
                <li key={task.id}>
                  {task.title} {task.completed ? '✅' : '❌'}
                  {task.reminder && ` | Reminder: ${task.reminder}`}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminView;
