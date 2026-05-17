require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Submission = require('./submission');

async function test() {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
    console.log("Connected");
    const subs = await Submission.find({ contestId: { $ne: null } });
    console.log("Submissions with contestId:", subs.map(s => ({ id: s._id, contestId: s.contestId, status: s.status })));
    process.exit();
}
test();
