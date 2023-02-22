const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const shortid = require('shortid');

const PORT = process.env.PORT || 8000;

const tasks = [];

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    task.id = shortid.generate();
    tasks.push(task);
    io.emit('addTask', task);
    console.log(`Add: ${JSON.stringify(task)}`);
    io.emit('updateData', tasks);
  });

  socket.on('removeTask', (id) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      const removedTask = tasks.splice(taskIndex, 1)[0];
      io.emit('removeTask', removedTask.id);
      console.log(`Task with ID ${id} removed`);
      io.emit('updateData', tasks);
    }
  });

  socket.on('editTask', (updatedTask) => {
    const taskIndex = tasks.findIndex((task) => task.id === updatedTask.id);
    if (taskIndex !== -1) {
      tasks[taskIndex].name = updatedTask.name;
      io.emit('updateTask', tasks[taskIndex]);
      console.log(`Task with ID ${updatedTask.id} renamed to ${updatedTask.name}`);
      io.emit('updateData', tasks);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
