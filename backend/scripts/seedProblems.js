// backend/scripts/seedProblems.js
const path = require('path');
const fs = require('fs');

async function runSeed() {
  // Lazy require to avoid issues on environments without done setup
  const connectDB = require('../config/db');
  // Try to import models with flexible casing
  let Problem, User;
  try { Problem = require('../models/Problem'); } catch (e) { Problem = require('../models/problem'); }
  try { User = require('../models/User'); } catch (e) { User = require('../models/user'); }

  await connectDB();

  const { loadSeedProblems } = require('../config/seedUtils');
  let seedPath = path.resolve(__dirname, '../seed/problems');
  if (!fs.existsSync(seedPath)) {
    const fallbackPath = path.resolve(__dirname, '../seed/problems.seed.json');
    if (fs.existsSync(fallbackPath)) {
      seedPath = fallbackPath;
    }
  }
  const problems = loadSeedProblems(seedPath);
  if (!problems.length) {
    console.log('No seed problems found in:', seedPath);
    process.exit(0);
  }
  let admin = null;
  try {
    admin = await User.findOne({ role: 'admin' });
  } catch (e) {}

  let countCreated = 0;
  let countUpdated = 0;
  for (const item of problems) {
    const payload = { ...item };
    if (admin && admin._id) payload.createdBy = admin._id;
    try {
      const existing = await Problem.findOne({ slug: payload.slug });
      if (existing) {
        await Problem.findOneAndUpdate({ slug: payload.slug }, payload, { returnDocument: 'after' });
        countUpdated++;
      } else {
        const created = new Problem(payload);
        await created.save();
        countCreated++;
      }
    } catch (err) {
      console.error('Seed problem error:', payload.slug, err.message);
    }
  }
  console.log(`Seed complete: ${countCreated} created, ${countUpdated} updated.`);
  process.exit(0);
}

runSeed().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
