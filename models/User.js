const pool = require('../config/db');

class User {
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
    profile_picture,
    address,
    city,
    country,
    postal_code,
    language_preference,
    timezone,
    default_warehouse_id,
    is_active = true,
    failed_login_attempts = 0,
    account_locked = false,
    two_factor_auth_enabled = false,
    password_changed_at,
    created_by,
    updated_by,
    deleted_by,
    last_login,
    last_ip_address,
    created_at,
    updated_at,
    deleted_at,
    notes
  }) {
    this.user_id = user_id;
    this.username = username;
    this.password_hash = password_hash;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.birth_date = birth_date;
    this.gender = gender;
    this.profile_picture = profile_picture;
    this.address = address;
    this.city = city;
    this.country = country;
    this.postal_code = postal_code;
    this.language_preference = language_preference;
    this.timezone = timezone;
    this.default_warehouse_id = default_warehouse_id;
    this.is_active = is_active;
    this.failed_login_attempts = failed_login_attempts;
    this.account_locked = account_locked;
    this.two_factor_auth_enabled = two_factor_auth_enabled;
    this.password_changed_at = password_changed_at;
    this.created_by = created_by;
    this.updated_by = updated_by;
    this.deleted_by = deleted_by;
    this.last_login = last_login;
    this.last_ip_address = last_ip_address;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
    this.notes = notes;
  }

  async save() {
    const result = await pool.query(
      `INSERT INTO users (
        username, password_hash, email, first_name, last_name, phone, birth_date, gender,
        profile_picture, address, city, country, postal_code, language_preference,
        timezone, default_warehouse_id, is_active, failed_login_attempts, account_locked,
        two_factor_auth_enabled, password_changed_at, created_by, updated_by, deleted_by,
        last_login, last_ip_address, created_at, updated_at, deleted_at, notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      ) RETURNING *`,
      [
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
        this.failed_login_attempts,
        this.account_locked,
        this.two_factor_auth_enabled,
        this.password_changed_at,
        this.created_by,
        this.updated_by,
        this.deleted_by,
        this.last_login,
        this.last_ip_address,
        this.created_at,
        this.updated_at,
        this.deleted_at,
        this.notes,
      ]
    );
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
}

module.exports = User;
