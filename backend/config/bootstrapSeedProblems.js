// backend/config/bootstrapSeedProblems.js
const fs = require('fs');
const path = require('path');

async function bootstrapSeedProblems() {
  try {
    const seedEnable = process.env.SEED_PROBLEMS_ENABLE === 'true' || process.env.ADMIN_BOOTSTRAP_ENABLE === 'true';
    // Optional: allow enabling seed via env; also invoked when admin bootstrap runs
    if (!seedEnable) {
      console.log('Seed problems disabled (SEED_PROBLEMS_ENABLE != true).');
      return;
    }
    const seedPath = path.resolve(__dirname, '../seed/problems.seed.json');
    if (!fs.existsSync(seedPath)) {
      console.log('Seed file not found:', seedPath);
      return;
    }
    const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    const problems = data.problems || [];
    // Lazy imports to avoid circular deps on boot
    const Problem = require('../models/Problem');
    const User = require('../models/User');
    // Get an admin as createdBy reference if exists
    const admin = await User.findOne({ role: 'admin' });
    const createdBy = admin ? admin._id : null;
    let countCreated = 0, countUpdated = 0;
    for (const p of problems) {
      const payload = { ...p };
      if (createdBy) payload.createdBy = createdBy;
      if (!payload.problemId) payload.problemId = payload.slug; // set problemId if missing
      const existing = await Problem.findOne({ slug: payload.slug });
      if (existing) {
        await Problem.findOneAndUpdate({ slug: payload.slug }, payload, { new: true });
        countUpdated++;
      } else {
        const doc = new Problem(payload);
        await doc.save();
        countCreated++;
      }
    }
    console.log(`SeedProblems: ${countCreated} created, ${countUpdated} updated (from seed).`);
  } catch (err) {
    console.error('SeedProblems bootstrap error:', err);
  }
}

module.exports = bootstrapSeedProblems;
