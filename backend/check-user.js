require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function checkUser() {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
    console.log('✅ Connected to DB');

    // Liệt kê tất cả users và email của họ
    const users = await User.find({}, 'email username displayname').limit(20);
    console.log('\n--- Users in DB ---');
    users.forEach(u => console.log(`  email: ${u.email}  |  username: ${u.username}  |  name: ${u.displayname}`));

    // Test email cụ thể
    const testEmail = '23521233@gm.uit.edu.vn';
    const found = await User.findOne({ email: testEmail });
    console.log(`\n--- Tìm email "${testEmail}" ---`);
    console.log(found ? `✅ Tìm thấy! username: ${found.username}` : '❌ Không tìm thấy trong DB');

    await mongoose.disconnect();
}

checkUser().catch(console.error);
