// backend/api/setting/settingRoutes.js
const express = require('express');
const router = express.Router();
const { updateAccount, updateAppearance, changePassword } = require('./settingController');
const auth = require('../../middleware/auth');

router.put('/account', auth, updateAccount);
router.put('/appearance', auth, updateAppearance);
router.put('/security/password', auth, changePassword);

module.exports = router;