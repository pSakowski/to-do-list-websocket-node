import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

function App() {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [editTask, setEditTask] = useState({ id: null, name: '' });

  useEffect(() => {
    const socket = io('http://localhost:8000');
    setSocket(socket);

    socket.on('updateData', (data) => {
      setTasks(data);
    });

    socket.on('addTask', (task) => {
      setTasks((tasks) => [...tasks, task]);
    });

    socket.on('removeTask', (taskId) => {
      setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    });

    socket.on('editTask', (task) => {
      setTasks((tasks) => tasks.map((t) => (t.id === task.id ? task : t)));
      setEditTask({ id: null, name: '' });
    });

    return () => socket.disconnect();
  }, []);

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTaskDelete = (taskId) => {
    socket.emit('removeTask', taskId);
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();
    if (editTask.id) {
      socket.emit('editTask', editTask);
    } else {
      const newTask = { id: shortid.generate(), name: taskName };
      socket.emit('addTask', newTask);
      setTasks((tasks) => [...tasks, newTask]);
      setTaskName('');
      socket.emit('updateData', [...tasks, newTask]);
    }
    setEditTask({ id: null, name: '' });
  };

  const handleEditClick = (task) => {
    setEditTask({ id: task.id, name: task.name });
  };

  const handleCancelClick = () => {
    setEditTask({ id: null, name: '' });
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li className="task" key={task.id}>
              {editTask.id === task.id ? (
                <>
                  <input
                    type="text"
                    className="task-edit"
                    value={editTask.name}
                    onChange={(event) =>
                      setEditTask({ ...editTask, name: event.target.value })
                    }
                  />
                  <div className="task-buttons">
                    <button className="btn" onClick={handleTaskSubmit}>
                      Save
                    </button>
                    <button className="btn btn--secondary" onClick={handleCancelClick}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{task.name}</span>
                  <div className="task-buttons">
                    <button className="btn btn--edit" onClick={() => handleEditClick(task)}>
                      Edit
                    </button>
                    <button className="btn btn--red" onClick={() => handleTaskDelete(task.id)}>
                      Remove
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={handleTaskSubmit}>
          <input 
            className="text-input" 
            autoComplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name" 
            value={taskName} 
            onChange={handleTaskNameChange}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>

      </section>
    </div>
  );
}

export default App;