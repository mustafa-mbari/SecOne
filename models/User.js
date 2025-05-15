const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
  /**
   * Constructor for User model
   * @param {Object} userData - User data object
   */
  constructor({
    user_id,
    username,
    password_hash,
    email,
    first_name,
    last_name,
    phone,
    birth_date,
    gender,
    profile_picture = 'default.jpg', // Default profile picture
    address,
    city,
    country,
    postal_code,
    language_preference = 'en', // Default language
    timezone = 'UTC', // Default timezone
    default_warehouse_id,
    is_active = true, // Default active status
    failed_login_attempts = 0, // Default failed attempts
    account_locked = false, // Default lock status
    two_factor_auth_enabled = false,
    password_changed_at = new Date(),
    created_by,
    updated_by,
    deleted_by,
    last_login,
    last_ip_address,
    created_at,
    updated_at,
    deleted_at,
    notes,
    verification_token = uuidv4(), // Auto-generate verification token
    email_verified = false, // Default verification status
    password_reset_token,
    password_reset_expires
  }) {
    // Assign all properties
    this.user_id = user_id;
    this.username = username;
    this.password_hash = password_hash;
    this.email = email;
    // ... (rest of property assignments)
    this.verification_token = verification_token;
    this.email_verified = email_verified;
    this.password_reset_token = password_reset_token;
    this.password_reset_expires = password_reset_expires;
  }

  /**
   * Save user to database
   * @returns {Promise<Object>} - Created user object
   */
  async save() {
    const query = `
      INSERT INTO users (
        username, password_hash, email, first_name, last_name, 
        phone, birth_date, gender, profile_picture, address,
        city, country, postal_code, language_preference,
        timezone, default_warehouse_id, is_active,
        verification_token, email_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
               $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`;
    
    const values = [
      this.username,
      this.password_hash,
      this.email,
      this.first_name,
      this.last_name,
      this.phone,
      this.birth_date,
      this.gender,
      this.profile_picture,
      this.address,
      this.city,
      this.country,
      this.postal_code,
      this.language_preference,
      this.timezone,
      this.default_warehouse_id,
      this.is_active,
      this.verification_token,
      this.email_verified
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM users WHERE deleted_at IS NULL');
    return result.rows;
  }

  static async getAllSort() {
    const result = await pool.query('SELECT * FROM users WHERE deleted_at IS NULL ORDER BY user_id DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0];
  }

  static async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Hash user password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hashed password
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} - True if match
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Find user by username or email
   * @param {string} identifier - Username or email
   * @returns {Promise<Object|null>} - User object or null
   */
  static async findByUsernameOrEmail(identifier) {
    const query = `
      SELECT * FROM users 
      WHERE (username = $1 OR email = $1) 
      AND deleted_at IS NULL`;
    const result = await pool.query(query, [identifier]);
    return result.rows[0] || null;
  }

  /**
   * Increment failed login attempts
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Updated user object
   */
  static async incrementFailedAttempts(userId) {
    const query = `
      UPDATE users 
      SET failed_login_attempts = failed_login_attempts + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *`;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Reset failed login attempts
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Updated user object
   */
  static async resetFailedAttempts(userId) {
    const query = `
      UPDATE users 
      SET failed_login_attempts = 0,
          account_locked = false,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *`;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Create password reset token
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Updated user object
   */
  static async createPasswordResetToken(userId) {
    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    
    const query = `
      UPDATE users 
      SET password_reset_token = $1,
          password_reset_expires = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $3
      RETURNING *`;
    
    const result = await pool.query(query, [token, expires, userId]);
    return result.rows[0];
  }

  /**
   * Verify user email
   * @param {string} token - Verification token
   * @returns {Promise<Object>} - Updated user object
   */
  static async verifyEmail(token) {
    const query = `
      UPDATE users 
      SET email_verified = true,
          verification_token = null,
          updated_at = CURRENT_TIMESTAMP
      WHERE verification_token = $1
      RETURNING *`;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  // ... (keep existing methods like getAll, getById, update, delete)
}

module.exports = User;

