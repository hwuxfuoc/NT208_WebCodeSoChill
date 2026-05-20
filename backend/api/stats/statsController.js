const Submission = require('../../models/submission');
const Contest = require('../../models/contest');

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getLocalMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setMilliseconds(0);
  return d;
}

// @desc    Get homepage daily activity counts for the last two weeks
// @route   GET /api/stats/daily-problems
const getDailyProblemsChart = async (req, res) => {
  try {
    const today = getLocalMidnight(new Date());
    const dayOfWeek = (today.getDay() + 6) % 7; // ISO Monday=0

    const lastTwoWeeksStart = new Date(today);
    lastTwoWeeksStart.setDate(lastTwoWeeksStart.getDate() - 13);

    const submissions = await Submission.find({
      status: 'accepted',
      createdAt: { $gte: lastTwoWeeksStart },
    }).select('createdAt').lean();

    const dailyProblems = DAY_NAMES.map((label) => ({ d: label, last: 0, now: 0 }));

    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(currentWeekStart.getDate() - dayOfWeek);
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    submissions.forEach((submission) => {
      const createdAt = getLocalMidnight(submission.createdAt);
      let bucket = null;
      let bucketStart = null;

      if (createdAt >= lastWeekStart && createdAt < currentWeekStart) {
        bucket = 'last';
        bucketStart = lastWeekStart;
      } else if (createdAt >= currentWeekStart && createdAt < nextWeekStart) {
        bucket = 'now';
        bucketStart = currentWeekStart;
      }

      if (!bucket || bucketStart === null) return;

      const index = Math.floor((createdAt.getTime() - bucketStart.getTime()) / 86400000);
      if (index >= 0 && index < 7) {
        dailyProblems[index][bucket] += 1;
      }
    });

    res.json({ dailyProblems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to load daily problem stats' });
  }
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// @desc    Get contest statistics by month for current and previous year
// @route   GET /api/stats/contest-stats
const getContestStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;
    const yearWindow = new Date(currentYear - 1, 0, 1);

    const contests = await Contest.find({
      startTime: { $gte: yearWindow },
    }).select('startTime').lean();

    const contestStats = MONTH_NAMES.map((month) => ({ month, last: 0, now: 0 }));

    contests.forEach((contest) => {
      const startTime = new Date(contest.startTime);
      const year = startTime.getFullYear();
      const monthIndex = startTime.getMonth();
      if (year === currentYear) {
        contestStats[monthIndex].now += 1;
      } else if (year === lastYear) {
        contestStats[monthIndex].last += 1;
      }
    });

    res.json({ contestStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to load contest statistics' });
  }
};

module.exports = { getDailyProblemsChart, getContestStats };
