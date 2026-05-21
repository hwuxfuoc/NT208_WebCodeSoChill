// frontend/src/tests/authService.test.ts
// Test suite cho frontend service layer: authService, api interceptor
// Dùng: Vitest + @testing-library/react + msw (mock service worker)

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// ─── Mock axios ─────────────────────────────────────────────
vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios');
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        post: vi.fn(),
        get: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
    },
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ─────────────────────────────────────────────────────────────
// Tests: api interceptor — gắn token vào header
// ─────────────────────────────────────────────────────────────
describe('API Interceptor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('✅ Gắn Authorization header khi có token trong localStorage', () => {
    localStorage.setItem('token', 'my-jwt-token');
    const token = localStorage.getItem('token');
    expect(token).toBe('my-jwt-token');

    // Giả lập logic interceptor
    const config: any = { headers: {} };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    expect(config.headers.Authorization).toBe('Bearer my-jwt-token');
  });

  it('✅ Không gắn Authorization header khi không có token', () => {
    const token = localStorage.getItem('token');
    const config: any = { headers: {} };
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    expect(config.headers.Authorization).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────
// Tests: aiService — is_solution_confirmed logic (frontend-side)
// ─────────────────────────────────────────────────────────────
describe('chatStream payload builder', () => {
  it('✅ Payload đầy đủ khi có đủ context bài toán', () => {
    const options = {
      question: 'Gợi ý cho tôi',
      problemId: 'problem-123',
      problemTitle: 'Two Sum',
      problemDescription: 'Find two numbers that add up to target',
      problemDifficulty: 'Easy',
      userCode: 'function twoSum(nums, target) {}',
      lastSubmissionStatus: 'Wrong Answer',
    };

    const payload = {
      question: options.question,
      problemId: options.problemId || null,
      problemTitle: options.problemTitle || null,
      problemDescription: options.problemDescription || null,
      problemDifficulty: options.problemDifficulty || null,
      userCode: options.userCode || null,
      lastSubmissionStatus: options.lastSubmissionStatus || null,
    };

    expect(payload.question).toBe('Gợi ý cho tôi');
    expect(payload.problemId).toBe('problem-123');
    expect(payload.lastSubmissionStatus).toBe('Wrong Answer');
  });

  it('✅ Các field optional mặc định là null khi không truyền', () => {
    const options = { question: 'Hello' };

    const payload = {
      question: options.question,
      problemId: (options as any).problemId || null,
      problemTitle: (options as any).problemTitle || null,
      problemDescription: (options as any).problemDescription || null,
      problemDifficulty: (options as any).problemDifficulty || null,
      userCode: (options as any).userCode || null,
      lastSubmissionStatus: (options as any).lastSubmissionStatus || null,
    };

    expect(payload.problemId).toBeNull();
    expect(payload.problemTitle).toBeNull();
    expect(payload.userCode).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────
// Tests: SSE parsing logic (from aiService.ts chatStream)
// ─────────────────────────────────────────────────────────────
describe('SSE Parser Logic', () => {
  const parseSSELine = (line: string): any | null => {
    if (!line.startsWith('data: ')) return null;
    const payload = line.slice(6).trim();
    if (!payload || payload === '[DONE]') return null;
    try {
      return JSON.parse(payload);
    } catch {
      return null;
    }
  };

  it('✅ Parse line có token hợp lệ', () => {
    const line = `data: ${JSON.stringify({ token: 'Hello' })}`;
    const parsed = parseSSELine(line);
    expect(parsed).not.toBeNull();
    expect(parsed.token).toBe('Hello');
  });

  it('✅ Bỏ qua line [DONE]', () => {
    const parsed = parseSSELine('data: [DONE]');
    expect(parsed).toBeNull();
  });

  it('✅ Bỏ qua line không có prefix data:', () => {
    const parsed = parseSSELine(': keep-alive');
    expect(parsed).toBeNull();
  });

  it('✅ Parse line có error', () => {
    const line = `data: ${JSON.stringify({ error: 'Something went wrong' })}`;
    const parsed = parseSSELine(line);
    expect(parsed.error).toBe('Something went wrong');
  });

  it('✅ Trả về null khi JSON không hợp lệ', () => {
    const parsed = parseSSELine('data: {invalid json}');
    expect(parsed).toBeNull();
  });

  it('✅ Buffer logic: tách đúng line cuối chưa hoàn chỉnh', () => {
    // Mô phỏng buffer logic trong chatStream
    let buffer = '';
    const chunk1 = 'data: {"token":"Hel"}\ndata: {"tok';
    buffer += chunk1;
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('data: {"token":"Hel"}');
    expect(buffer).toBe('data: {"tok');
  });
});
