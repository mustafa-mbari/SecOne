// app.js

const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');

const app = express();
const PORT = 3000;

// ✅ تفعيل قراءة البيانات بصيغة JSON
app.use(express.json());

// ✅ المسارات الرئيسية (ثابتة)
app.get('/', (req, res) => {
  res.send('Welcome in Express App!');
});

app.get('/about', (req, res) => {
  res.send('About site');
});

app.get('/contact', (req, res) => {
  res.send('For contact: email@example.com');
});

// Roles
app.use('/roles', roleRoutes);

// Users
app.use('/users', userRoutes);



// Error handling (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message
  });
});

// ✅ ميدلوير معالجة الأخطاء (يجب أن يكون في النهاية)
app.use(errorHandler);

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
