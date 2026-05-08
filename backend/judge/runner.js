// backend/judge/runner.js
// Hệ thống chấm bài tự động.
// Giai đoạn này dùng Judge0 API (cloud sandbox) thay vì tự chạy code trực tiếp trên server,
// đảm bảo an toàn tuyệt đối – code của user không bao giờ chạy trên server chính.
//
// Để dùng file này cần:
//   1. Đăng ký tài khoản miễn phí tại https://rapidapi.com/judge0-official/api/judge0-ce
//   2. Thêm vào .env:
//      JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
//      JUDGE0_API_KEY=your_rapidapi_key_here

const axios = require('axios');
const TestCase = require('../models/testCase');

// Map ngôn ngữ → language_id của Judge0
// Danh sách đầy đủ: https://ce.judge0.com/languages
const LANGUAGE_MAP = {
    'c':          49,
    'cpp':        54,
    'java':       62,
    'python':     71,  // Python 3
    'javascript': 63,  // Node.js
    'typescript': 74,
    'go':         60,
    'rust':       73,
    'kotlin':     78,
    'csharp':     51,
    'swift':      83,
    'php':        68,
    'ruby':       72,
};

// Map status_id của Judge0 → status trong schema của mình
const STATUS_MAP = {
    1:  'pending',                  // In Queue
    2:  'pending',                  // Processing
    3:  'accepted',                 // Accepted
    4:  'wrong_answer',             // Wrong Answer
    5:  'time_limit_exceeded',      // Time Limit Exceeded
    6:  'compile_error',            // Compilation Error
    7:  'runtime_error',            // Runtime Error (SIGSEGV)
    8:  'runtime_error',            // Runtime Error (SIGXFSZ)
    9:  'runtime_error',            // Runtime Error (SIGFPE)
    10: 'runtime_error',            // Runtime Error (SIGABRT)
    11: 'runtime_error',            // Runtime Error (NZEC)
    12: 'runtime_error',            // Runtime Error (Other)
    13: 'runtime_error',            // Internal Error
    14: 'memory_limit_exceeded',    // Exec Format Error
};

const normalizeTestCases = (testCases = []) => {
    return testCases
        .map((tc, index) => ({
            order: typeof tc.order === 'number' ? tc.order : index + 1,
            input: tc.input ?? tc.stdin ?? '',
            output: tc.output ?? tc.expectedOutput ?? tc.expected_output ?? '',
            isSample: !!tc.isSample,
        }))
        .filter((tc) => tc.input !== undefined && tc.output !== undefined);
};

/**
 * Gửi 1 submission lên Judge0 và chờ kết quả
 * @param {string} sourceCode
 * @param {number} languageId
 * @param {string} stdin
 * @param {string} expectedOutput
 * @param {number} timeLimitMs
 * @param {number} memoryLimitMB
 * @returns {{ status, executionTime, memoryUsed, output }}
 */
const judgeOne = async (sourceCode, languageId, stdin, expectedOutput, timeLimitMs, memoryLimitMB) => {
    const apiUrl = process.env.JUDGE0_API_URL;
    const apiKey = process.env.JUDGE0_API_KEY;

    // Bước 1: Submit lên Judge0
    const submitRes = await axios.post(
        `${apiUrl}/submissions?base64_encoded=false&wait=false`,
        {
            source_code: sourceCode,
            language_id: languageId,
            stdin: stdin,
            expected_output: expectedOutput,
            cpu_time_limit: timeLimitMs / 1000,     // Judge0 dùng đơn vị giây
            memory_limit: memoryLimitMB * 1024,     // Judge0 dùng đơn vị KB
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            }
        }
    );

    const token = submitRes.data.token;

    // Bước 2: Polling kết quả (tối đa 10 lần, mỗi 1 giây)
    let result = null;
    for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const statusRes = await axios.get(
            `${apiUrl}/submissions/${token}?base64_encoded=false&fields=status,time,memory,stdout,stderr,compile_output`,
            {
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                }
            }
        );

        result = statusRes.data;
        // status_id 1 hoặc 2 = đang xử lý, tiếp tục chờ
        if (result.status.id > 2) break;
    }

    if (!result) {
        return { status: 'runtime_error', executionTime: 0, memoryUsed: 0, output: '' };
    }

    return {
        status: STATUS_MAP[result.status.id] || 'runtime_error',
        executionTime: result.time ? Math.round(parseFloat(result.time) * 1000) : 0,  // Chuyển về ms
        memoryUsed: result.memory ? Math.round(result.memory / 1024) : 0,             // Chuyển về MB
        output: result.stdout || result.stderr || result.compile_output || '',
    };
};

/**
 * Chạy toàn bộ testcase cho một bài nộp
 * @param {{ problemId, language, code, timeLimit, memoryLimit, sampleOnly? }}
 * @returns {{ status, testResult, timeUsed, memoryUsed, passedTests, totalTests }}
 */
const runCode = async ({ problemId, language, code, timeLimit, memoryLimit, sampleOnly = false, testCases: providedTestCases = [] }) => {
    const languageId = LANGUAGE_MAP[language];
    if (!languageId) {
        return {
            status: 'compile_error',
            testResult: [],
            timeUsed: 0,
            memoryUsed: 0,
            passedTests: 0,
            totalTests: 0,
        };
    }

    let testCases = [];
    if (Array.isArray(providedTestCases) && providedTestCases.length > 0) {
        testCases = providedTestCases;
        if (sampleOnly && providedTestCases.some((tc) => tc.isSample !== undefined)) {
            testCases = providedTestCases.filter((tc) => tc.isSample);
        }
    } else {
        const query = { problemId };
        if (sampleOnly) query.isSample = true;
        testCases = await TestCase.find(query).sort({ order: 1 }).lean();
    }

    const normalizedTestCases = normalizeTestCases(testCases);
    if (normalizedTestCases.length === 0) {
        return {
            status: 'runtime_error',
            testResult: [],
            timeUsed: 0,
            memoryUsed: 0,
            passedTests: 0,
            totalTests: 0,
        };
    }

    const testResult = [];
    let passedTests = 0;
    let maxTime = 0;
    let maxMemory = 0;
    let overallStatus = 'accepted'; // Sẽ cập nhật nếu có test fail

    for (const tc of normalizedTestCases) {
        let oneResult;
        try {
            oneResult = await judgeOne(code, languageId, tc.input, tc.output, timeLimit, memoryLimit);
        } catch (err) {
            console.error('Judge0 error:', err.message);
            oneResult = { status: 'runtime_error', executionTime: 0, memoryUsed: 0, output: '' };
        }

        testResult.push({
            testCaseOrder: tc.order,
            status: oneResult.status,
            executionTime: oneResult.executionTime,
            memoryUsed: oneResult.memoryUsed,
            output: oneResult.output,
        });

        if (oneResult.status === 'accepted') {
            passedTests++;
        } else if (overallStatus === 'accepted') {
            // Lưu lại status của test đầu tiên bị fail
            overallStatus = oneResult.status;
        }

        if (oneResult.executionTime > maxTime) maxTime = oneResult.executionTime;
        if (oneResult.memoryUsed > maxMemory) maxMemory = oneResult.memoryUsed;
    }

    return {
        status: overallStatus,
        testResult,
        timeUsed: maxTime,
        memoryUsed: maxMemory,
        passedTests,
        totalTests: normalizedTestCases.length,
    };
};

module.exports = { runCode };