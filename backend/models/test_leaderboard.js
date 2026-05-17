require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Contest = require('./contest');
const Submission = require('./submission');

async function testLeaderboard() {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
    
    // Tìm contest đang diễn ra (có submission)
    const sub = await Submission.findOne({ contestId: { $ne: null } });
    if (!sub) {
        console.log("No submissions with contestId found.");
        process.exit();
    }
    
    const contestId = sub.contestId;
    console.log("Contest ID:", contestId);
    
    const submissions = await Submission.find({ contestId, status: 'accepted' })
            .populate('userId', 'username displayname avatarUrl')
            .populate('problemId', 'problemId');
            
    console.log("Accepted Submissions:", submissions.length);
    
    const scoreMap = {};
    for (const s of submissions) {
        const uid = s.userId._id.toString();
        if (!scoreMap[uid]) {
            scoreMap[uid] = { user: s.userId, solved: new Set(), lastAcceptedAt: s.createdAt };
        }
        scoreMap[uid].solved.add(s.problemId._id.toString());
        if (s.createdAt > scoreMap[uid].lastAcceptedAt) {
            scoreMap[uid].lastAcceptedAt = s.createdAt;
        }
    }
    
    const leaderboard = Object.values(scoreMap)
            .map(entry => ({ user: entry.user.username, solved: entry.solved.size, lastAcceptedAt: entry.lastAcceptedAt }))
            .sort((a, b) => b.solved - a.solved || a.lastAcceptedAt - b.lastAcceptedAt);
            
    console.log("Leaderboard:", leaderboard);
    process.exit();
}
testLeaderboard();
