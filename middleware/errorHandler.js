//errorHandler.js
// Global error handling middleware

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log the full error to the console
  console.error('--- Error caught by middleware ---');
  console.error('Message:', err.message);
  console.error('Status Code:', statusCode);
  console.error('Details:', err.details || 'No additional details');
  console.error('Stack:', err.stack);
  console.error('----------------------------------');

  // Respond with structured JSON error
  res.status(statusCode).json({
    error: err.message,
    details: err.details || null,
    status: statusCode
  });
};
