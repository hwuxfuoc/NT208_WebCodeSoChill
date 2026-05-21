// backend/tests/problems.test.js
// Test suite cho Problems API: getProblems, getProblem, createProblem
// Dùng: Jest + Supertest + mongodb-memory-server

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');

let mongoServer;
let adminToken;
let userToken;

const sampleProblem = {
  title: 'Two Sum',
  description: 'Given an array of integers, return indices of the two numbers such that they add up to target.',
  difficulty: 'Easy',
  topics: ['Array', 'Hash Table'],
  examples: [{ input: '[2,7,11,15], target=9', output: '[0,1]' }],
  constraints: '2 <= nums.length <= 10^4',
  starterCode: { javascript: 'function twoSum(nums, target) {}', python: 'def twoSum(nums, target):' },
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Tạo user thường
  const userRes = await request(app).post('/api/auth/register').send({
    username: 'normaluser',
    email: 'user@example.com',
    password: 'password123',
    displayname: 'Normal User',
  });
  userToken = userRes.body.token;

  // Tạo admin (cần set role = 'admin' trực tiếp trong DB)
  const adminRes = await request(app).post('/api/auth/register').send({
    username: 'adminuser',
    email: 'admin@example.com',
    password: 'password123',
    displayname: 'Admin User',
  });
  adminToken = adminRes.body.token;

  // Promote admin user
  const User = require('../models/user');
  await User.findOneAndUpdate({ email: 'admin@example.com' }, { role: 'admin' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ─────────────────────────────────────────────────────────────
// GET /api/problems
// ─────────────────────────────────────────────────────────────
describe('GET /api/problems', () => {
  test('✅ Lấy danh sách bài toán thành công (public)', async () => {
    const res = await request(app).get('/api/problems');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('problems');
    expect(Array.isArray(res.body.problems)).toBe(true);
  });

  test('✅ Hỗ trợ filter theo difficulty', async () => {
    const res = await request(app).get('/api/problems?difficulty=Easy');
    expect(res.statusCode).toBe(200);
  });

  test('✅ Hỗ trợ filter theo topic', async () => {
    const res = await request(app).get('/api/problems?topic=Array');
    expect(res.statusCode).toBe(200);
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/problems/daily
// ─────────────────────────────────────────────────────────────
describe('GET /api/problems/daily', () => {
  test('✅ Lấy bài toán hằng ngày thành công', async () => {
    const res = await request(app).get('/api/problems/daily');
    // Có thể 200 (nếu có bài) hoặc 404 (nếu chưa có bài nào)
    expect([200, 404]).toContain(res.statusCode);
  });
});

// ─────────────────────────────────────────────────────────────
// POST /api/problems (Admin only)
// ─────────────────────────────────────────────────────────────
describe('POST /api/problems', () => {
  test('✅ Admin tạo bài toán mới thành công', async () => {
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(sampleProblem);
    expect(res.statusCode).toBe(201);
    expect(res.body.problem.title).toBe(sampleProblem.title);
  });

  test('❌ User thường không được tạo bài toán (403)', async () => {
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${userToken}`)
      .send(sampleProblem);
    expect(res.statusCode).toBe(403);
  });

  test('❌ Tạo bài toán thất bại khi không có token (401)', async () => {
    const res = await request(app).post('/api/problems').send(sampleProblem);
    expect(res.statusCode).toBe(401);
  });

  test('❌ Tạo bài toán thất bại khi thiếu title', async () => {
    const { title, ...noTitle } = sampleProblem;
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(noTitle);
    expect([400, 422, 500]).toContain(res.statusCode);
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/problems/:id
// ─────────────────────────────────────────────────────────────
describe('GET /api/problems/:id', () => {
  let problemId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...sampleProblem, title: 'Get By ID Test' });
    problemId = res.body.problem?._id || res.body.problem?.id;
  });

  test('✅ Lấy bài toán theo ID thành công', async () => {
    const res = await request(app).get(`/api/problems/${problemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.problem.title).toBe('Get By ID Test');
  });

  test('❌ Trả về 404 khi không tìm thấy bài toán', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/problems/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
