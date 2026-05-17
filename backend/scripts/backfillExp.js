// backend/scripts/backfillExp.js
// Chạy 1 lần để tính lại EXP cho tất cả user từ submissions accepted đã có trong DB
// Cách chạy: node backend/scripts/backfillExp.js

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Submission = require('../models/submission');
const Problem = require('../models/problem');
const User = require('../models/user');

const EXP_MAP = { easy: 25, medium: 50, hard: 100 };

async function backfill() {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
    console.log('✅ Connected to MongoDB');

    // Lấy tất cả submission accepted, group theo (userId, problemId) — chỉ lấy lần đầu AC
    const firstACs = await Submission.aggregate([
        { $match: { status: 'accepted' } },
        { $sort: { createdAt: 1 } },
        {
            $group: {
                _id: { userId: '$userId', problemId: '$problemId' },
                firstAC: { $first: '$$ROOT' }
            }
        },
        {
            $lookup: {
                from: 'problems',
                localField: '_id.problemId',
                foreignField: '_id',
                as: 'problem'
            }
        },
        { $unwind: '$problem' },
        {
            $group: {
                _id: '$_id.userId',
                totalExp: {
                    $sum: {
                        $switch: {
                            branches: [
                                { case: { $eq: ['$problem.difficulty', 'easy']   }, then: 25 },
                                { case: { $eq: ['$problem.difficulty', 'medium'] }, then: 50 },
                                { case: { $eq: ['$problem.difficulty', 'hard']   }, then: 100 },
                            ],
                            default: 25
                        }
                    }
                }
            }
        }
    ]);

    console.log(`🔍 Found ${firstACs.length} users with accepted submissions`);

    let updated = 0;
    for (const row of firstACs) {
        await User.findByIdAndUpdate(row._id, { $set: { experiencePoints: row.totalExp } });
        console.log(`  → userId ${row._id}: set experiencePoints = ${row.totalExp}`);
        updated++;
    }

    console.log(`\n✅ Done! Updated ${updated} users.`);
    await mongoose.disconnect();
}

backfill().catch(err => {
    console.error('❌ Backfill failed:', err);
    process.exit(1);
});
