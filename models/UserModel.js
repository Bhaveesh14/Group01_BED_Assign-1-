const sql = require('mssql');
const db = require('../db'); // assumes db connection is initialized here

const UserModel = {
  // Read user by ID
  getUserById: async (id) => {
    try {
      const request = new sql.Request();
      request.input('id', sql.Int, id);

      const result = await request.query(`
        SELECT * FROM Users WHERE UserID = @id
      `);

      return result.recordset[0];
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },

  // Read all users
  getAllUsers: async () => {
    try {
      const result = await new sql.Request().query(`
        SELECT * FROM Users
      `);
      return result.recordset;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  // Update user email and password
  updateUser: async (id, email, password) => {
    try {
      const request = new sql.Request();
      request.input('id', sql.Int, id);
      request.input('email', sql.VarChar, email);
      request.input('password', sql.VarChar, password); // ideally hashed

      await request.query(`
        UPDATE Users
        SET Email = @email, PasswordHash = @password
        WHERE UserID = @id
      `);

      return { message: 'User updated successfully' };
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  }
};

module.exports = UserModel;
