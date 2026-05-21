// backend/tests/auth.test.js
// Test suite cho Auth API: register, login, getMe
// Dùng: Jest + Supertest + mongodb-memory-server (in-memory DB)

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // app tách riêng không listen

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Xóa dữ liệu sau mỗi test để tránh conflict
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  const validUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    displayname: 'Test User',
  };

  test('✅ Đăng ký thành công với dữ liệu hợp lệ', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(validUser.email);
    expect(res.body.user.username).toBe(validUser.username);
  });

  test('❌ Đăng ký thất bại khi thiếu email', async () => {
    const { email, ...noEmail } = validUser;
    const res = await request(app).post('/api/auth/register').send(noEmail);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('❌ Đăng ký thất bại khi email không hợp lệ', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, email: 'not-an-email' });
    expect(res.statusCode).toBe(400);
  });

  test('❌ Đăng ký thất bại khi password < 6 ký tự', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: '123' });
    expect(res.statusCode).toBe(400);
  });

  test('❌ Đăng ký thất bại khi username/email đã tồn tại', async () => {
    // Tạo user lần 1
    await request(app).post('/api/auth/register').send(validUser);
    // Tạo user lần 2 với cùng dữ liệu
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/đã tồn tại/i);
  });
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  const credentials = { email: 'login@example.com', password: 'password123' };

  beforeEach(async () => {
    // Tạo user trước mỗi login test
    await request(app).post('/api/auth/register').send({
      username: 'loginuser',
      displayname: 'Login User',
      ...credentials,
    });
  });

  test('✅ Đăng nhập thành công', async () => {
    const res = await request(app).post('/api/auth/login').send(credentials);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(credentials.email);
  });

  test('❌ Đăng nhập thất bại với sai password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ ...credentials, password: 'wrongpassword' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/không đúng/i);
  });

  test('❌ Đăng nhập thất bại với email không tồn tại', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.statusCode).toBe(400);
  });

  test('❌ Đăng nhập thất bại khi thiếu email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'password123' });
    expect(res.statusCode).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────────
describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'meuser',
      email: 'me@example.com',
      password: 'password123',
      displayname: 'Me User',
    });
    token = res.body.token;
  });

  test('✅ Lấy thông tin user khi có token hợp lệ', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('email', 'me@example.com');
    expect(res.body.user).not.toHaveProperty('hashedPassword');
  });

  test('❌ Trả về 401 khi không có token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  test('❌ Trả về 401 khi token sai', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.statusCode).toBe(401);
  });
});
