const pool = require('../config/db');

class Role {
  constructor({
    role_id,
    role_name,
    description,
    level = 0,
    is_active = true,
    is_system_role = false,
    created_by,
    updated_by,
    deleted_by,
    created_at,
    updated_at,
    deleted_at
  }) {
    this.role_id = role_id;
    this.role_name = role_name;
    this.description = description;
    this.level = level;
    this.is_active = is_active;
    this.is_system_role = is_system_role;
    this.created_by = created_by;
    this.updated_by = updated_by;
    this.deleted_by = deleted_by;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
  }

  async save() {
    const result = await pool.query(
      `INSERT INTO roles (
        role_name, description, level, is_active, is_system_role,
        created_by, updated_by, deleted_by, created_at, updated_at, deleted_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        this.role_name,
        this.description,
        this.level,
        this.is_active,
        this.is_system_role,
        this.created_by,
        this.updated_by,
        this.deleted_by,
        this.created_at,
        this.updated_at,
        this.deleted_at
      ]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query('SELECT * FROM roles WHERE deleted_at IS NULL');
    return result.rows;
  }

  static async getAllSort() {
    const result = await pool.query('SELECT * FROM roles WHERE deleted_at IS NULL ORDER BY role_id DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query('SELECT * FROM roles WHERE role_id = $1 AND deleted_at IS NULL', [id]);
    return result.rows[0];
  }

  static async getByName(name) {
    const result = await pool.query('SELECT * FROM roles WHERE role_name = $1 AND deleted_at IS NULL', [name]);
    return result.rows[0];
  }

  static async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE roles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE role_id = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `UPDATE roles SET deleted_at = CURRENT_TIMESTAMP WHERE role_id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Role;