const pool = require('../config/db');

class UserRole {
  constructor({
    user_role_id,
    user_id,
    role_id,
    is_active = true,
    expiry_date,
    assigned_by,
    created_by,
    updated_by,
    deleted_by,
    created_at,
    updated_at,
    deleted_at,
    notes
  }) {
    this.user_role_id = user_role_id;
    this.user_id = user_id;
    this.role_id = role_id;
    this.is_active = is_active;
    this.expiry_date = expiry_date;
    this.assigned_by = assigned_by;
    this.created_by = created_by;
    this.updated_by = updated_by;
    this.deleted_by = deleted_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
    this.notes = notes;
  }

  async save() {
    const result = await pool.query(
      `INSERT INTO user_roles (
        user_id, role_id, is_active, expiry_date, assigned_by,
        created_by, updated_by, deleted_by, created_at, updated_at, deleted_at, notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING *`,
      [
        this.user_id,
        this.role_id,
        this.is_active,
        this.expiry_date,
        this.assigned_by,
        this.created_by,
        this.updated_by,
        this.deleted_by,
        this.created_at,
        this.updated_at,
        this.deleted_at,
        this.notes
      ]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM user_roles WHERE deleted_at IS NULL');
    return result.rows;
  }

  static async getAllSort() {
    const result = await pool.query('SELECT * FROM user_roles WHERE deleted_at IS NULL ORDER BY user_role_id DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM user_roles WHERE user_role_id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const result = await pool.query(`
      SELECT ur.*, r.role_name, r.description as role_description 
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.role_id
      WHERE ur.user_id = $1 AND ur.deleted_at IS NULL
    `, [userId]);
    return result.rows;
  }

  static async getByRoleId(roleId) {
    const result = await pool.query(`
      SELECT ur.*, u.username, u.email 
      FROM user_roles ur
      JOIN users u ON ur.user_id = u.user_id
      WHERE ur.role_id = $1 AND ur.deleted_at IS NULL
    `, [roleId]);
    return result.rows;
  }

  static async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE user_roles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE user_role_id = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `UPDATE user_roles SET deleted_at = CURRENT_TIMESTAMP WHERE user_role_id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  static async deleteByUserAndRole(userId, roleId) {
    const result = await pool.query(
      `UPDATE user_roles SET deleted_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND role_id = $2 AND deleted_at IS NULL 
       RETURNING *`,
      [userId, roleId]
    );
    return result.rows[0];
  }
}

module.exports = UserRole;