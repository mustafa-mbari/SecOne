// app.js
const express = require('express');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const PORT = 3000;

// ✅ Enable parsing JSON request bodies
app.use(express.json());

// ✅ Main routes
app.get('/', (req, res) => {
  res.send('Welcome in Express App!');
});

app.get('/about', (req, res) => {
  res.send('About site');
});

app.get('/contact', (req, res) => {
  res.send('For contact: email@example.com');
});

// ✅ 404 Middleware - Not Found
app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.statusCode = 404;
  next(err); // Send to global error handler
});

// ✅ Error Handling Middleware (should be last)
app.use(errorHandler);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`The server now live on port ${PORT}`);
});
