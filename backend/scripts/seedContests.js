// backend/scripts/seedContests.js
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Contest = require('../models/contest');
const User = require('../models/user');
const Problem = require('../models/problem');

const SEASON_NUMBER = 1;
const CONTEST_COUNT = 30;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const CURRENT_CONTEST_INDEX = 10; // Contest đang diễn ra là contest thứ 11
const CONTEST_START_HOURS = [9, 13, 19];

const THEMED_CONTEST_NAMES = [
  'Array Sprint',
  'Graph Challenge',
  'Dynamic Programming Night',
  'Backend Algorithm Cup',
  'Data Structure Duel',
];

const MAJOR_CONTEST_NAMES = [
  'Scaling Algorithms Championship',
  'Advanced Systems Gauntlet',
  'Optimized Code Invitational',
  'Performance Push Contest',
  'Hardcore Algorithm Showdown',
];

const NORMAL_CONTEST_DESCRIPTIONS = [
  'Fast-paced contest focusing on mixed algorithmic problems.',
  'Solve a small set of balanced coding challenges in a sprint format.',
  'A daily-like contest for building consistency and speed.',
  'Classic mixed-difficulty contest designed for steady progression.',
  'A fresh batch of algorithm problems with varied difficulty.',
];

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandomIds(pool, count, exclude = new Set()) {
  const choices = pool.filter((id) => !exclude.has(id.toString()));
  const shuffled = shuffleArray(choices);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function buildProblemSelection(problemsByDifficulty) {
  return (desiredCount, distribution) => {
    const selected = new Set();

    Object.entries(distribution).forEach(([difficulty, amount]) => {
      const pool = problemsByDifficulty[difficulty] || [];
      pickRandomIds(pool, amount).forEach((id) => selected.add(id.toString()));
    });

    const allPools = [...problemsByDifficulty.easy, ...problemsByDifficulty.medium, ...problemsByDifficulty.hard];
    let fallbackIndex = 0;
    while (selected.size < desiredCount && fallbackIndex < allPools.length) {
      const id = allPools[fallbackIndex].toString();
      if (!selected.has(id)) selected.add(id);
      fallbackIndex += 1;
    }

    return Array.from(selected).slice(0, desiredCount).map((id) => new mongoose.Types.ObjectId(id));
  };
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ role: 'admin' }) || await User.findOne();
    if (!user) {
      console.log('❌ Không tìm thấy user nào để làm người tạo contest.');
      return;
    }

    const problems = await Problem.find({ isActive: true });
    if (problems.length < 15) {
      console.log('❌ Không đủ bài tập (cần ít nhất 15 bài) để seed contest đa dạng.');
      return;
    }

    const problemsByDifficulty = {
      easy: problems.filter((p) => p.difficulty === 'easy').map((p) => p._id),
      medium: problems.filter((p) => p.difficulty === 'medium').map((p) => p._id),
      hard: problems.filter((p) => p.difficulty === 'hard').map((p) => p._id),
    };

    const selectProblems = buildProblemSelection(problemsByDifficulty);

    // Lấy season mới nhất
    const lastContest = await Contest.findOne().sort({ season: -1, endTime: -1 });
    const currentMaxSeason = lastContest ? lastContest.season : 0;
    const newSeason = currentMaxSeason + 1;

    // Giữ lại 10 season mới nhất (bao gồm cả season chuẩn bị tạo) => cần xóa các season < newSeason - 9
    const minSeasonToKeep = newSeason - 9;
    if (minSeasonToKeep > 0) {
      await Contest.deleteMany({ season: { $lt: minSeasonToKeep } });
      console.log(`🗑️  Đã xóa các contest thuộc season < ${minSeasonToKeep} để giữ lại 10 season mới nhất.`);
    }

    // Tính toán thời gian bắt đầu
    let baseStartTime = new Date();
    // Nếu có season cũ chưa kết thúc, nối tiếp vào sau nó
    if (lastContest && lastContest.endTime > baseStartTime) {
        baseStartTime = new Date(lastContest.endTime.getTime() + ONE_DAY_MS);
    }
    // Đặt baseStartTime về 0h để chia slot trong ngày được chuẩn xác
    baseStartTime.setHours(0, 0, 0, 0);

    const contests = [];

    for (let index = 0; index < CONTEST_COUNT; index += 1) {
      let title = `Season ${newSeason} Contest #${index + 1}`;
      let description = NORMAL_CONTEST_DESCRIPTIONS[index % NORMAL_CONTEST_DESCRIPTIONS.length];
      let problemCount = 4;
      let duration = 180;
      let ratedFor = 'all';
      let distribution = { easy: 1, medium: 2, hard: 1 };

      if (index >= 20 && index < 25) {
        const majorIndex = index - 20;
        title = `Season ${newSeason} Major #${majorIndex + 1}: ${MAJOR_CONTEST_NAMES[majorIndex]}`;
        description = 'A higher-stakes contest with harder problems and extended duration.';
        problemCount = 6;
        duration = 180;
        ratedFor = 'advanced';
        distribution = { easy: 1, medium: 2, hard: 3 };
      } else if (index >= 25) {
        const themeIndex = index - 25;
        title = `Season ${newSeason} Themed #${themeIndex + 1}: ${THEMED_CONTEST_NAMES[themeIndex]}`;
        description = `Themed contest focusing on ${THEMED_CONTEST_NAMES[themeIndex].toLowerCase()}.`;
        problemCount = 5;
        duration = 150;
        ratedFor = themeIndex % 2 === 0 ? 'intermediate' : 'all';
        distribution = { easy: 1, medium: 2, hard: 2 };
      } else {
        if (index % 3 === 0) {
          problemCount = 3;
          distribution = { easy: 1, medium: 1, hard: 1 };
        } else if (index % 3 === 1) {
          problemCount = 4;
          distribution = { easy: 1, medium: 2, hard: 1 };
        } else {
          problemCount = 5;
          distribution = { easy: 2, medium: 2, hard: 1 };
        }
      }

      const dayOffset = Math.floor(index / CONTEST_START_HOURS.length);
      const slotIndex = index % CONTEST_START_HOURS.length;
      
      const startTime = new Date(baseStartTime.getTime() + dayOffset * ONE_DAY_MS);
      startTime.setHours(CONTEST_START_HOURS[slotIndex], 0, 0, 0);
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      
      const problemsForContest = selectProblems(problemCount, distribution);
      const contestType = index >= 25 ? 'themed' : index >= 20 ? 'major' : 'normal';
      const theme = index >= 25 ? THEMED_CONTEST_NAMES[index - 25] : '';

      contests.push(new Contest({
        title,
        description,
        startTime,
        endTime,
        duration,
        problems: problemsForContest,
        participants: [],
        ratedFor,
        contestType,
        theme,
        season: newSeason,
        contestNumber: index + 1,
        isRated: true,
        createdBy: user._id,
      }));
    }

    await Contest.insertMany(contests);
    console.log(`✅ Đã tạo thành công ${contests.length} contest cho Season mới: ${newSeason}.`);
  } catch (err) {
    console.error('❌ Lỗi:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
