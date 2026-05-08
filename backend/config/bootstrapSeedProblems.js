// backend/config/bootstrapSeedProblems.js
const fs = require('fs');
const path = require('path');
const { loadSeedProblems } = require('./seedUtils');

async function bootstrapSeedProblems() {
  try {
    const seedEnable = process.env.SEED_PROBLEMS_ENABLE === 'true';
    if (!seedEnable) {
      console.log('Seed problems disabled (SEED_PROBLEMS_ENABLE != true).');
      return;
    }

    let seedPath = path.resolve(__dirname, '../seed/problems');
    if (!fs.existsSync(seedPath)) {
      const fallbackPath = path.resolve(__dirname, '../seed/problems.seed.json');
      if (fs.existsSync(fallbackPath)) {
        seedPath = fallbackPath;
      } else {
        console.log('Seed problems path not found:', seedPath);
        return;
      }
    }

    const problems = loadSeedProblems(seedPath);
    if (!problems.length) {
      console.log('No seed problems found in:', seedPath);
      return;
    }

    // Lazy imports to avoid circular deps on boot
    const Problem = require('../models/problem');
    const User = require('../models/user');

    const admin = await User.findOne({ role: 'admin' });
    const createdBy = admin ? admin._id : null;

    // ✅ bulkWrite thay vì loop - nhanh hơn 10-20 lần
    const ops = problems.map((p) => {
      const payload = { ...p };
      if (createdBy) payload.createdBy = createdBy;
      if (!payload.problemId) payload.problemId = payload.slug;

      return {
        updateOne: {
          filter: { slug: payload.slug },
          update: { $set: { ...payload, isActive: true } },
          upsert: true
        }
      };
    });

    const result = await Problem.bulkWrite(ops, { ordered: false });
    console.log(`SeedProblems: ${result.upsertedCount} created, ${result.modifiedCount} updated (from seed).`);
  } catch (err) {
    console.error('SeedProblems bootstrap error:', err);
  }
}

module.exports = bootstrapSeedProblems;