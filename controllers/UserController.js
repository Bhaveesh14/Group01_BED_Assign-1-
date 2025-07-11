const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');

const UserController = {
 getUserById: async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Exclude password from the response
      const { password, ...userData } = user;
      return res.status(200).json(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateUser: async (req, res) => {
    const userIdFromParam = parseInt(req.params.id);
    const { username, password, role } = req.body;
    const requestingUser = req.user; // from JWT

    // 🔐 Restrict update access
    const isSelfUpdate = requestingUser.userId === userIdFromParam;
    const isAdmin = requestingUser.role === 'admin';

    // ⛔ Prevent non-admins from updating other users
    if (!isAdmin && !isSelfUpdate) {
      console.warn(`[SECURITY] User ${requestingUser.username} (ID: ${requestingUser.userId}) attempted to update another user (ID: ${userIdFromParam})`);
      return res.status(403).json({ message: 'You can only update your own account' });
    }

    // ⛔ Prevent non-admins from changing role
    if (!isAdmin && role && role !== 'user') {
      console.warn(`[SECURITY] User ${requestingUser.username} tried to escalate role to '${role}'`);
      return res.status(403).json({ message: 'You are not allowed to change your role' });
    }

    try {
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

      const updated = await UserModel.updateUser(userIdFromParam, {
        username,
        password: hashedPassword,
        role: isAdmin ? role : 'user' // only use role if admin
      });

      if (updated) {
        return res.status(200).json({ message: 'User updated successfully' });
      } else {
        return res.status(404).json({ message: 'User not found or no changes made' });
      }
    } catch (err) {
      console.error('Update error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  deleteUser: async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
      const deleted = await UserModel.deleteUser(userId);
      if (deleted) {
        return res.status(200).json({ message: 'User deleted successfully' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = UserController;
