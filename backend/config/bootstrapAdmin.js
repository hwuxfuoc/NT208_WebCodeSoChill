// backend/config/bootstrapAdmin.js
// Use bcrypt if available, fallback to bcryptjs for environments without native bindings
let bcrypt;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  try {
    bcrypt = require('bcryptjs');
  } catch (e2) {
    bcrypt = null;
  }
}
if (!bcrypt) {
  console.warn('Neither bcrypt nor bcryptjs is installed. Admin bootstrap cannot hash passwords.');
  module.exports = async () => {};
  return;
}

const User = require('../models/user');
const Setting = require('../models/setting');

async function bootstrapAdmin() {
  try {
    // Enable flag
    const enable = process.env.ADMIN_BOOTSTRAP_ENABLE === 'true';
    if (!enable) {
      console.log('Admin bootstrap is disabled (ADMIN_BOOTSTRAP_ENABLE != true).');
      return;
    }

    // Check if bootstrap already done
    const flag = await Setting.findOne({ key: 'bootstrapAdminDone' });
    if (flag && flag.value === true) {
      console.log('Bootstrap admin already completed.');
      return;
    }

    // If an admin already exists, mark bootstrap as done
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      await Setting.findOneAndUpdate(
        { key: 'bootstrapAdminDone' },
        { $set: { value: true } },
        { upsert: true, new: true }
      );
      console.log('Admin already exists. Bootstrap marked as done.');
      return;
    }

    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_DISPLAYNAME } = process.env;
    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn('Admin bootstrap variables missing. Skipping bootstrap.');
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const user = new User({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      hashedPassword,
      displayname: ADMIN_DISPLAYNAME || ADMIN_USERNAME,
      role: 'admin',
      isVerified: true
    });
    await user.save();
    await Setting.findOneAndUpdate(
      { key: 'bootstrapAdminDone' },
      { $set: { value: true } },
      { upsert: true, new: true }
    );
    console.log('Bootstrap admin created:', ADMIN_EMAIL);
  } catch (err) {
    console.error('Bootstrap admin error:', err);
  }
}

module.exports = bootstrapAdmin;
