// backend/scripts/seedContests.js
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Contest = require('../models/contest');
const User = require('../models/user');
const Problem = require('../models/problem');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGOOSE_DB_URL);
        console.log('✅ Connected to MongoDB');

        // Lấy admin (hoặc user đầu tiên)
        const user = await User.findOne({ role: 'admin' }) || await User.findOne();
        if (!user) {
            console.log('❌ Không tìm thấy user nào để làm người tạo contest.');
            return;
        }

        // Lấy 5 bài tập bất kỳ
        const problems = await Problem.find().limit(5);
        if (problems.length < 2) {
            console.log('❌ Không đủ bài tập (cần ít nhất 2 bài) để tạo contest.');
            return;
        }

        const problemIds = problems.map(p => p._id);

        // Xóa sạch contest cũ
        await Contest.deleteMany({});
        console.log('🗑️  Đã xóa các contest cũ.');

        const now = new Date();

        // 1. Contest đã kết thúc
        const endedContest = new Contest({
            title: 'CodeSoChill Inaugural Sprint',
            description: 'The very first contest to test your logic and algorithmic skills.',
            startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
            endTime: new Date(now.getTime() - 46 * 60 * 60 * 1000),   // ended 46 hours ago
            duration: 120, // 2 hours
            problems: problemIds.slice(0, 3), // Lấy 3 bài đầu
            participants: [user._id],
            ratedFor: 'all',
            isRated: true,
            createdBy: user._id
        });

        // 2. Contest đang diễn ra
        const ongoingContest = new Contest({
            title: 'Biweekly Architectural Challenge #42',
            description: 'Tackle real-world software architecture and algorithmic puzzles in this live challenge.',
            startTime: new Date(now.getTime() - 30 * 60 * 1000), // Bắt đầu 30 phút trước
            endTime: new Date(now.getTime() + 90 * 60 * 1000),   // Kết thúc sau 90 phút nữa
            duration: 120, // 2 hours
            problems: problemIds.slice(0, 4), // Lấy 4 bài
            participants: [],
            ratedFor: 'all',
            isRated: true,
            createdBy: user._id
        });

        // 3. Contest sắp diễn ra
        const upcomingContest = new Contest({
            title: 'Spring Microservices Sprint',
            description: 'Get ready for the ultimate coding sprint focusing on microservices patterns.',
            startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Bắt đầu ngày mai
            endTime: new Date(now.getTime() + 26 * 60 * 60 * 1000),
            duration: 120, // 2 hours
            problems: problemIds, // Lấy tất cả 5 bài
            participants: [],
            ratedFor: 'advanced',
            isRated: true,
            createdBy: user._id
        });

        await Promise.all([
            endedContest.save(),
            ongoingContest.save(),
            upcomingContest.save()
        ]);

        console.log('✅ Đã tạo thành công 3 contest (Ended, Ongoing, Upcoming).');
    } catch (err) {
        console.error('❌ Lỗi:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
