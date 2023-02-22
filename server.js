// const express = require('express');
// const socket = require('socket.io');

// const app = express();
// const port = 8000;

// // Start the server
// const server = app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// // Set up Socket.IO
// const io = socket(server);

// // Initialize the users array
// let tasks = [];

// // Handle a new connection to the server
// io.on('connection', (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   // send tasks data to the new user
//   socket.emit('updateData', tasks);

//   // handle addTask event
//   socket.on('addTask', (task) => {
//     // add task to tasks array
//     tasks.push(task);

//     // emit addTask event to other sockets
//     socket.broadcast.emit('addTask', task);
//   });

//   // // Handle disconnection from the client
//   // socket.on('disconnect', () => {
//   //   console.log(`Client disconnected: ${socket.id}`);

//   // handle removeTask event
//   socket.on('removeTask', (id) => {
//     const taskIndex = tasks.findIndex((task) => task.id === id);
//     if (taskIndex !== -1) {
//       const [removedTask] = tasks.splice(taskIndex, 1);
//       socket.broadcast.emit('removeTask', removedTask.id);
//     }
//   });
// });

// app.use((req, res) => {
//   res.status(404).send({ message: 'Not found' });
// });



const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 8000;

const tasks = [];

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      const removedTask = tasks.splice(taskIndex, 1)[0];
      socket.broadcast.emit('removeTask', removedTask.id);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});