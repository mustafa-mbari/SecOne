// services/userService.js
const pool = require('../config/db');

const getUsernameById = async (userId) => {
    try {
  const result = await pool.query('SELECT username FROM users WHERE user_id = $1', [userId]);

  if (result.rows.length === 0) {
    throw AppError.notFound('Username not found', {userId});
  }

  return result.rows[0];
  } catch (err) {
    console.error(`Error in getUsernameById for userId ${userId}:`, err);
    throw err; // ممكن ترجع null بدلًا من رمي الخطأ حسب حاجتك
  }
};

module.exports = {
  getUsernameById,
};