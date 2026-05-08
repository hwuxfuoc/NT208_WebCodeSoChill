// backend/api/admin/adminController.js
const User = require('../../models/user');

// @desc    Promote a user to admin
// @route   POST /api/admin/promote/:userId
const promoteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = 'admin';
    await user.save();
    res.json({ message: 'User promoted to admin', user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  promoteUser,
};

