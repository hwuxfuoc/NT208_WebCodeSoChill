require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Contest = require('./contest');
const Submission = require('./submission');
require('./user');
require('./problem');

async function testContestLeaderboard() {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
    const sub = await Submission.findOne({ contestId: { $ne: null }, status: 'accepted' });
    const req = { params: { id: sub.contestId } };
    const res = { 
        json: (data) => console.log(JSON.stringify(data, null, 2)),
        status: (code) => ({ json: (data) => console.log(code, data) })
    };
    
    try {
        const contest = await Contest.findById(req.params.id).populate('problems');
        const submissions = await Submission.find({ contestId: req.params.id, status: 'accepted' })
            .populate('userId', 'username displayname avatarUrl')
            .populate('problemId', 'problemId');

        const scoreMap = {};
        for (const sub of submissions) {
            if (!sub.userId) continue;
            const uid = sub.userId._id.toString();
            if (!scoreMap[uid]) {
                scoreMap[uid] = { user: sub.userId, solved: new Set(), lastAcceptedAt: sub.createdAt };
            }
            if (sub.problemId) {
                scoreMap[uid].solved.add(sub.problemId._id.toString());
            }
            if (sub.createdAt > scoreMap[uid].lastAcceptedAt) {
                scoreMap[uid].lastAcceptedAt = sub.createdAt;
            }
        }

        const leaderboard = Object.values(scoreMap)
            .map(entry => ({ user: entry.user, solved: entry.solved.size, lastAcceptedAt: entry.lastAcceptedAt }))
            .sort((a, b) => b.solved - a.solved || a.lastAcceptedAt - b.lastAcceptedAt);

        res.json({ leaderboard });
    } catch (e) {
        console.error(e);
    }
    process.exit();
}
testContestLeaderboard();
