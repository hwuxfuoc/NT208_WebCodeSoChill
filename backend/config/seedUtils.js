const fs = require('fs');
const path = require('path');

function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');
}

function normalizeDifficulty(value) {
  if (value == null) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (normalized.startsWith('easy')) return 'easy';
  if (normalized.startsWith('medium')) return 'medium';
  if (normalized.startsWith('hard')) return 'hard';
  return normalized;
}

function parseExampleText(exampleText) {
  if (!exampleText) return { input: '', output: '', explanation: '' };
  const text = String(exampleText);
  const inputMatch = text.match(/Input:\s*([\s\S]*?)(?=\nOutput:|\nExplanation:|$)/i);
  const outputMatch = text.match(/Output:\s*([\s\S]*?)(?=\nExplanation:|$)/i);
  const explanationMatch = text.match(/Explanation:\s*([\s\S]*?)$/i);

  return {
    input: inputMatch ? inputMatch[1].trim() : '',
    output: outputMatch ? outputMatch[1].trim() : '',
    explanation: explanationMatch ? explanationMatch[1].trim() : ''
  };
}

function normalizeProblemPayload(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const payload = { ...raw };

  if (!payload.problemId && payload.problem_id != null) payload.problemId = String(payload.problem_id);
  if (!payload.problemId && payload.frontend_id != null) payload.problemId = String(payload.frontend_id);
  if (!payload.slug && payload.problem_slug) payload.slug = payload.problem_slug;
  if (!payload.slug && payload.problemId) payload.slug = String(payload.problemId);
  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
  if (typeof payload.slug === 'string') payload.slug = payload.slug.trim();

  if (!payload.difficulty && payload.Difficulty) payload.difficulty = payload.Difficulty;
  if (payload.difficulty) payload.difficulty = normalizeDifficulty(payload.difficulty);

  if (Array.isArray(payload.constraints)) {
    payload.constraints = payload.constraints.join('\n');
  }

  if (!payload.description && payload.content) {
    payload.description = payload.content;
  }

  if ((!payload.samples || payload.samples.length === 0) && Array.isArray(payload.examples)) {
    payload.samples = payload.examples
      .map((example) => {
        const exampleText = example.example_text || example.exampleText || example.text || '';
        return parseExampleText(exampleText);
      })
      .filter((sample) => sample.input || sample.output || sample.explanation);
  }

  if (!Array.isArray(payload.samples)) payload.samples = [];
  if (!Array.isArray(payload.testCases)) payload.testCases = [];
  if (!Array.isArray(payload.tags)) payload.tags = payload.tags ? [payload.tags].flat() : [];
  if (!Array.isArray(payload.topics)) payload.topics = payload.topics ? [payload.topics].flat() : [];

  if (!payload.problemId) payload.problemId = payload.slug || slugify(payload.title || '');
  if (!payload.slug) payload.slug = slugify(payload.title || payload.problemId || 'unnamed-problem');

  return payload;
}

function loadProblemsFromData(raw) {
  if (Array.isArray(raw)) {
    return raw.map(normalizeProblemPayload).filter(Boolean);
  }
  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.problems)) {
      return raw.problems.map(normalizeProblemPayload).filter(Boolean);
    }
    return [normalizeProblemPayload(raw)].filter(Boolean);
  }
  return [];
}

function loadSeedProblems(seedRoot) {
  const resolvedPath = path.resolve(seedRoot);
  if (!fs.existsSync(resolvedPath)) return [];

  const stats = fs.statSync(resolvedPath);
  if (stats.isFile()) {
    const raw = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
    return loadProblemsFromData(raw);
  }

  if (stats.isDirectory()) {
    const files = fs.readdirSync(resolvedPath)
      .filter((name) => name.toLowerCase().endsWith('.json'))
      .sort();

    let problems = [];
    for (const file of files) {
      const filePath = path.join(resolvedPath, file);
      try {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        problems = problems.concat(loadProblemsFromData(raw));
      } catch (err) {
        console.warn(`Skipping invalid seed file: ${filePath}`, err.message);
      }
    }
    return problems;
  }

  return [];
}

module.exports = { loadSeedProblems };
