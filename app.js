// index.js

const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');

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

// ✅ مسارات المستخدمين
app.use('/users', userRoutes);

// ✅ ميدلوير 404 - Route Not Found
app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.statusCode = 404;
  next(err);
});

// ✅ ميدلوير معالجة الأخطاء (يجب أن يكون في النهاية)
app.use(errorHandler);

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
