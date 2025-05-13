//index.js

const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler'); // <-- 1. استيراد معالج الأخطاء

app.use(express.json());
app.use('/users', userRoutes);

// ... أي middleware أخرى قد تكون لديك يجب أن تكون هنا ...

// ✅ تسجيل معالج الأخطاء (يجب أن يكون هذا هو آخر middleware)
app.use(errorHandler); // <-- 2. تسجيل معالج الأخطاء

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000') ;
});