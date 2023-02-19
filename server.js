const express = require('express');
const app = express();

// Middleware to catch all requests and return "Not found" message
app.use((req, res) => {
  res.status(404).send('Not found');
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});