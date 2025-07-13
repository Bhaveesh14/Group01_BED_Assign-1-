const sql = require('mssql');
const db = require('../db'); // assumes db connection is initialized here

const UserModel = {
  // Create a new user
  createUser: async (user) => {
    const request = new sql.Request();
    request.input('name', sql.VarChar, user.name);
    request.input('email', sql.VarChar, user.email);
    request.input('passwordHash', sql.VarChar, user.password); // Consider hashing
    request.input('dob', sql.Date, user.dateOfBirth);
    request.input('gender', sql.VarChar, user.gender);
    request.input('conditions', sql.Text, user.healthConditions || '');

    const result = await request.query(`
      INSERT INTO Users (Name, Email, PasswordHash, DateOfBirth, Gender, HealthConditions)
      VALUES (@name, @email, @passwordHash, @dob, @gender, @conditions);
      SELECT SCOPE_IDENTITY() AS UserID;
    `);

    return { userId: result.recordset[0].UserID };
  },

  // Read user by ID
  getUserById: async (id) => {
    const request = new sql.Request();
    request.input('id', sql.Int, id);

    const result = await request.query(`
      SELECT * FROM Users WHERE UserID = @id
    `);

    return result.recordset[0];
  },

  // Read all users
  getAllUsers: async () => {
    const result = await new sql.Request().query(`
      SELECT * FROM Users
    `);
    return result.recordset;
  },

  // Update user email and password
  updateUser: async (id, email, password) => {
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
  },

  // Delete user
  deleteUser: async (id) => {
    const request = new sql.Request();
    request.input('id', sql.Int, id);

    await request.query(`
      DELETE FROM Users WHERE UserID = @id
    `);

    return { message: 'User deleted successfully' };
  }
};

module.exports = UserModel;

