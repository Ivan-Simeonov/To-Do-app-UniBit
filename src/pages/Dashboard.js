import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Dashboard.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    reminder: null,
    type: 'personal',
  });

  if (!user) {
    return <p>You must be logged in to view the dashboard.</p>;
  }

  useEffect(() => {
    fetch(`http://localhost:5001/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Failed to fetch tasks:', err));
  }, []);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setNewTask({ ...newTask, reminder: date });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      userId: user.id,
      completed: false,
      reminder: newTask.reminder
        ? newTask.reminder.toISOString().slice(0, 16)
        : null,
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
        setNewTask({ title: '', reminder: null, type: 'personal' });
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
        setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
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
        setTasks(tasks.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const personalTasks = tasks.filter(
    (task) => task.userId === user.id && task.type === 'personal'
  );

  const teamTasks = tasks.filter((task) => task.type === 'team');

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username}</h2>

      <h3>Create New Task</h3>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={newTask.title}
          onChange={handleInputChange}
          required
        />
        <DatePicker
          selected={newTask.reminder}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText="Select date and time"
        />
        <label>
          Task Type:
          <select
            name="type"
            value={newTask.type}
            onChange={handleInputChange}
          >
            <option value="personal">Personal</option>
            <option value="team">Team</option>
          </select>
        </label>
        <button type="submit">Add Task</button>
      </form>

      <h3>My Tasks</h3>
      <ul>
        {personalTasks.length === 0 ? (
          <p>No personal tasks.</p>
        ) : (
          personalTasks.map((task) => (
            <li key={task.id}>
              {task.title} {task.completed ? '✅' : '❌'}{' '}
              {task.reminder && `| Reminder: ${task.reminder}`}
              <button onClick={() => toggleComplete(task)}>✔</button>
              <button onClick={() => deleteTask(task.id)}>🗑</button>
            </li>
          ))
        )}
      </ul>

      <h3>Team Tasks</h3>
      <ul>
        {teamTasks.length === 0 ? (
          <p>No team tasks.</p>
        ) : (
          teamTasks.map((task) => (
            <li key={task.id}>
              {task.title} {task.completed ? '✅' : '❌'}{' '}
              {task.reminder && `| Reminder: ${task.reminder}`}
              {user.role === 'leader' && (
                <>
                  <button onClick={() => toggleComplete(task)}>✔</button>
                  <button onClick={() => deleteTask(task.id)}>🗑</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
