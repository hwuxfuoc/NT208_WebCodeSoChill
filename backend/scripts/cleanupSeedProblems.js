require('dotenv').config();
const path = require('path');
const fs = require('fs');

const connectDB = require('../config/db');
const { loadSeedProblems } = require('../config/seedUtils');
let Problem;
try {
  Problem = require('../models/Problem');
} catch (err) {
  Problem = require('../models/problem');
}

async function run() {
  await connectDB();

  let seedPath = path.resolve(__dirname, '../seed/problems');
  if (!fs.existsSync(seedPath)) {
    const fallbackPath = path.resolve(__dirname, '../seed/problems.seed.json');
    if (fs.existsSync(fallbackPath)) {
      seedPath = fallbackPath;
    } else {
      console.error('Seed path not found. Please make sure backend/seed/problems or backend/seed/problems.seed.json exists.');
      process.exit(1);
    }
  }

  const problems = loadSeedProblems(seedPath);
  if (!problems.length) {
    console.error('No seed problems found in:', seedPath);
    process.exit(1);
  }

  const currentSlugs = problems.map((p) => p.slug).filter(Boolean);
  if (!currentSlugs.length) {
    console.error('No valid problem slugs found in seed.');
    process.exit(1);
  }

  const deleteMode = process.argv.includes('--delete');
  const filter = { slug: { $nin: currentSlugs } };

  if (deleteMode) {
    const result = await Problem.deleteMany(filter);
    console.log(`Deleted ${result.deletedCount} problem(s) that are not present in the current seed.`);
  } else {
    const result = await Problem.updateMany(filter, { $set: { isActive: false } });
    console.log(`Updated ${result.modifiedCount} problem(s) to isActive=false that are not present in the current seed.`);
  }

  const activeCount = await Problem.countDocuments({ isActive: true });
  const totalCount = await Problem.countDocuments();
  console.log(`Current database totals: ${activeCount} active, ${totalCount} total.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Cleanup seed problems failed:', err);
  process.exit(1);
});
