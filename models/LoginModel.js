const bcrypt = require('bcrypt');
const db = require('../config/database'); // Assuming this is your DB connection

const UserModel = {
  findByUsername: async (username) => {
    const query = 'SELECT * FROM Users WHERE username = ?';
    const [rows] = await db.query(query, [username]);
    return rows[0]; // Return user object or undefined
  },

  validatePassword: async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
};

module.exports = UserModel;
