import { useEffect, useState } from 'react';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', reminder: '' });

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5001/tasks?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error('Failed to fetch tasks:', err));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      userId: user.id,
      completed: false,
    };

    try {
      const res = await fetch('http://localhost:5001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToAdd),
      });

      if (res.ok) {
        const added = await res.json();
        setTasks([...tasks, added]);
        setNewTask({ title: '', reminder: '' });
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const toggleComplete = async (task) => {
    const updated = { ...task, completed: !task.completed };

    try {
      const res = await fetch(`http://localhost:5001/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/tasks/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div>
      <h2>Welcome, {user?.username}</h2>
      <h3>Your Tasks</h3>

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={newTask.title}
          onChange={handleInputChange}
          required
        />
        <br />
        <input
          type="datetime-local"
          name="reminder"
          value={newTask.reminder}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map(task => (
            <li key={task.id}>
              {task.title} {task.completed ? '✅' : '❌'}
              {task.reminder && ` | Reminder: ${task.reminder}`}
              <button onClick={() => toggleComplete(task)}>✔</button>
              <button onClick={() => deleteTask(task.id)}>🗑</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
