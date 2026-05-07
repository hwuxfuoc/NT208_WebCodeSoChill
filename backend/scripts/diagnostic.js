// backend/scripts/diagnostic.js
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runDiagnostics() {
  console.log('========================================');
  console.log('   Database & Seed Diagnostics');
  console.log('========================================\n');

  // Check environment
  console.log('📋 Environment Check:');
  console.log(`   MONGOOSE_DB_URL: ${process.env.MONGOOSE_DB_URL ? '✓ Set' : '✗ Not set'}`);
  console.log(`   Node Env: ${process.env.NODE_ENV || 'development'}\n`);

  // Check seed files
  console.log('📁 Seed Files Check:');
  const seedJsonPath = path.resolve(__dirname, '../seed/problems.seed.json');
  const seedDirPath = path.resolve(__dirname, '../seed/problems');

  let seedJsonCount = 0;
  let seedDirCount = 0;

  if (fs.existsSync(seedJsonPath)) {
    try {
      const content = JSON.parse(fs.readFileSync(seedJsonPath, 'utf-8'));
      seedJsonCount = Array.isArray(content.problems) ? content.problems.length : 0;
      console.log(`   ✓ problems.seed.json: ${seedJsonCount} problems`);
    } catch (e) {
      console.log(`   ✗ problems.seed.json: Parse error - ${e.message}`);
    }
  } else {
    console.log(`   ✗ problems.seed.json: Not found`);
  }

  if (fs.existsSync(seedDirPath)) {
    const files = fs.readdirSync(seedDirPath).filter(f => f.endsWith('.json'));
    seedDirCount = files.length;
    console.log(`   ✓ seed/problems/ directory: ${seedDirCount} files`);
  } else {
    console.log(`   ✗ seed/problems/ directory: Not found`);
  }

  console.log();

  // Connect to database
  console.log('🔌 Database Connection:');
  try {
    const mongoose = require('mongoose');

    // Import models - handle case variations
    let Problem, User;
    try {
      Problem = require('../models/Problem');
    } catch (e) {
      Problem = require('../models/problem');
    }
    try {
      User = require('../models/User');
    } catch (e) {
      User = require('../models/user');
    }

    await mongoose.connect(process.env.MONGOOSE_DB_URL);
    console.log('   ✓ Connected to MongoDB');

    // Count problems
    console.log('\n📊 Database Statistics:');
    const problemCount = await Problem.countDocuments();
    console.log(`   Total Problems: ${problemCount}`);

    if (problemCount > 0) {
      const problems = await Problem.find({}).select('title slug difficulty').limit(5);
      console.log(`\n   First ${Math.min(5, problemCount)} problems:`);
      problems.forEach((p, i) => {
        console.log(`     ${i + 1}. ${p.title} (${p.slug}) - ${p.difficulty}`);
      });

      if (problemCount > 5) {
        console.log(`     ... and ${problemCount - 5} more`);
      }
    }

    // Check user
    const userCount = await User.countDocuments();
    console.log(`\n   Total Users: ${userCount}`);
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`   Admin Users: ${adminCount}`);

    // Seed Status Summary
    console.log('\n✅ Seed Loading Status:');
    if (problemCount === 0 && seedJsonCount > 0) {
      console.log(`   ⚠️  ISSUE: ${seedJsonCount} problems in seed file, but 0 in database`);
      console.log('   💡 Run: node backend/scripts/seedProblems.js');
    } else if (problemCount === seedJsonCount && seedJsonCount > 0) {
      console.log(`   ✓ Database (${problemCount}) matches seed file (${seedJsonCount}) - All seeded!`);
    } else if (problemCount > seedJsonCount && seedJsonCount > 0) {
      console.log(`   ℹ️  Database (${problemCount}) > Seed file (${seedJsonCount})`);
      console.log('   This could mean additional problems were added manually.');
    } else if (problemCount > 0 && seedJsonCount === 0) {
      console.log(`   ℹ️  Database has ${problemCount} problems but no seed file found`);
    } else {
      console.log('   ℹ️  No problems in database and no seed file - Ready to seed');
    }

    console.log('\n========================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.log(`   ✗ Connection failed: ${err.message}`);
    console.log('\n   Please ensure:');
    console.log('   1. MongoDB is running');
    console.log('   2. MONGOOSE_DB_URL is set in .env');
    console.log('   3. Database credentials are correct\n');
    process.exit(1);
  }
}

runDiagnostics().catch(err => {
  console.error('Diagnostic failed:', err);
  process.exit(1);
});