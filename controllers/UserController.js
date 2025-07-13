const UserModel = require('../models_Temp/UserModel');

const userController = {
  // GET user by ID
  getUser: async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
      const user = await UserModel.getUserById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({
        email: user.Email,
        // Never expose passwords in production — even if hashed
        password: user.PasswordHash 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // PUT update user email and password
  updateUser: async (req, res) => {
    const userId = parseInt(req.params.id);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const result = await UserModel.updateUser(userId, email, password); // Calls updateUser method from model
      res.json(result); // { message: 'User updated successfully' }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
};

module.exports = userController;
