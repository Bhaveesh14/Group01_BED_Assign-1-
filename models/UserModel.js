const bcrypt = require('bcrypt');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

const UserModel = {
  findByUsername: async (username) => {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('username', sql.VarChar, username)
        .query('SELECT * FROM Users WHERE username = @username');

      return result.recordset[0];
    } catch (error) {
      console.error('DB query error:', error);
      throw error;
    } finally {
      if (pool) await pool.close();
    }
  },

  validatePassword: async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  },

  createUser: async (user) => {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('username', sql.VarChar, user.username)
        .input('password', sql.VarChar, user.password)
        .input('role', sql.VarChar, user.role)
        .query('INSERT INTO Users (username, password, role) VALUES (@username, @password, @role)');

      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error('DB insert error:', error);
      throw error;
    } finally {
      if (pool) await pool.close();
    }
  }
};

module.exports = UserModel;
