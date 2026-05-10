// backend/judge/runner.js
// Hệ thống chấm bài tự động (Local Execution)
// Code được chạy bằng child_process của Node.js

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const TestCase = require('../models/testCase');
const Problem = require('../models/problem');

// Đảm bảo thư mục temp_code tồn tại
const tempDir = path.join(__dirname, '../temp_code');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Cấu hình ngôn ngữ hỗ trợ
const SUPPORTED_LANGUAGES = {
    'cpp': {
        ext: 'cpp',
        compile: (filePath, baseName) => {
            return new Promise((resolve, reject) => {
                const exePath = path.join(tempDir, `${baseName}.exe`);
                // Biên dịch C++
                exec(`g++ "${filePath}" -O2 -o "${exePath}"`, (error, stdout, stderr) => {
                    if (error) {
                        return reject(stderr || stdout || error.message);
                    }
                    resolve(exePath);
                });
            });
        },
        getRunCmd: (exePath) => ({ cmd: exePath, args: [] })
    },
    'python': {
        ext: 'py',
        getRunCmd: (filePath) => ({ cmd: 'python', args: [filePath] })
    },
    'javascript': {
        ext: 'js',
        getRunCmd: (filePath) => ({ cmd: 'node', args: [filePath] })
    }
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

// Hàm so sánh chuỗi linh hoạt (bỏ qua khác biệt khoảng trắng dư thừa)
const compareOutput = (actual, expected) => {
    const normalize = str => str.trim().split('\n').map(l => l.trim()).join('\n');
    return normalize(actual || '') === normalize(expected || '');
};

// Hàm thực thi code cho 1 testcase
const executeCode = (cmd, args, stdin, timeLimitMs) => {
    return new Promise((resolve) => {
        const start = Date.now();
        const child = spawn(cmd, args);
        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        const timer = setTimeout(() => {
            child.kill('SIGKILL');
            resolve({
                status: 'time_limit_exceeded',
                executionTime: timeLimitMs,
                output: (stdout || stderr || 'Time Limit Exceeded').slice(0, 5000)
            });
        }, timeLimitMs);

        if (stdin) {
            child.stdin.write(stdin);
        }
        child.stdin.end();

        child.on('close', (code, signal) => {
            clearTimeout(timer);
            const executionTime = Date.now() - start;
            if (signal === 'SIGKILL') return; // Đã xử lý ở timeout
            
            if (code !== 0) {
                return resolve({
                    status: 'runtime_error',
                    executionTime,
                    output: (stderr || stdout || `Exited with code ${code}`).slice(0, 5000)
                });
            }
            resolve({
                status: 'success',
                executionTime,
                output: stdout.trim()
            });
        });

        child.on('error', (err) => {
            clearTimeout(timer);
            resolve({
                status: 'runtime_error',
                executionTime: Date.now() - start,
                output: err.message
            });
        });
    });
};

/**
 * Chạy toàn bộ testcase cho một bài nộp
 */
const runCode = async ({ problemId, language, code, timeLimit, memoryLimit, sampleOnly = false, testCases: providedTestCases = [] }) => {
    // 1. Kiểm tra ngôn ngữ
    const langConfig = SUPPORTED_LANGUAGES[language];
    if (!langConfig) {
        return {
            status: 'compile_error',
            testResult: [{ testCaseOrder: 1, status: 'compile_error', output: `Ngôn ngữ ${language} chưa được hệ thống hỗ trợ.` }],
            timeUsed: 0,
            memoryUsed: 0,
            passedTests: 0,
            totalTests: 0,
        };
    }

    // 2. Lấy testcase
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

    let normalizedTestCases = normalizeTestCases(testCases);

    // [FALLBACK] Đọc từ JSON file nếu DB không có testcase
    if (normalizedTestCases.length === 0) {
        try {
            const problem = await Problem.findById(problemId);
            if (problem) {
                // Định dạng tên file: "1. Two Sum.json"
                const jsonFileName = `${problem.problemId}. ${problem.title}.json`;
                const jsonPath = path.join(__dirname, '../seed/testcase/data/json', jsonFileName);
                if (fs.existsSync(jsonPath)) {
                    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
                    const parsed = JSON.parse(fileContent);
                    if (parsed.testcases && Array.isArray(parsed.testcases)) {
                        let parsedTcs = parsed.testcases;
                        if (sampleOnly && parsedTcs.length > 0) {
                            parsedTcs = [parsedTcs[0]];
                        }
                        
                        testCases = parsedTcs.map((tc, index) => {
                            const expected = tc.expected;
                            const inputs = { ...tc };
                            delete inputs.expected;
                            
                            const formatVal = (v) => {
                                if (Array.isArray(v)) {
                                    // Chuyển mảng [2, 7] thành "2 7" để các ngôn ngữ dễ đọc qua split()
                                    return v.map(item => typeof item === 'object' ? JSON.stringify(item) : String(item)).join(' ');
                                }
                                if (typeof v === 'object' && v !== null) return JSON.stringify(v);
                                return String(v);
                            };

                            const inputValues = Object.values(inputs).map(formatVal).join('\n');
                            const outputValue = formatVal(expected);
                            
                            return {
                                order: index + 1,
                                input: inputValues,
                                output: outputValue,
                                isSample: sampleOnly
                            };
                        });
                        normalizedTestCases = normalizeTestCases(testCases);
                    }
                }
            }
        } catch (e) {
            console.error('Lỗi khi đọc file testcase JSON dự phòng:', e);
        }
    }

    if (normalizedTestCases.length === 0) {
        return {
            status: 'runtime_error',
            testResult: [{ testCaseOrder: 1, status: 'runtime_error', output: 'Không tìm thấy testcase nào.' }],
            timeUsed: 0,
            memoryUsed: 0,
            passedTests: 0,
            totalTests: 0,
        };
    }

    // 3. Chuẩn bị file
    const baseName = crypto.randomUUID();
    const filePath = path.join(tempDir, `${baseName}.${langConfig.ext}`);
    let exePath = null;
    let runTarget = filePath;

    try {
        fs.writeFileSync(filePath, code);

        // 4. Biên dịch (nếu có)
        if (langConfig.compile) {
            try {
                exePath = await langConfig.compile(filePath, baseName);
                runTarget = exePath;
            } catch (compileError) {
                // Xoá file nguồn nếu lỗi biên dịch
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                return {
                    status: 'compile_error',
                    testResult: [{ testCaseOrder: 1, status: 'compile_error', output: compileError }],
                    timeUsed: 0,
                    memoryUsed: 0, // Local execution khó tính chính xác bộ nhớ bằng child_process
                    passedTests: 0,
                    totalTests: normalizedTestCases.length
                };
            }
        }

        const testResult = [];
        let passedTests = 0;
        let maxTime = 0;
        let overallStatus = 'accepted';

        const { cmd, args } = langConfig.getRunCmd(runTarget);

        // 5. Chạy từng testcase
        for (const tc of normalizedTestCases) {
            // Giới hạn thời gian (mặc định 2000ms nếu ko có)
            const tlMs = timeLimit ? timeLimit * 1000 : 2000;
            const res = await executeCode(cmd, args, tc.input, tlMs);

            let finalStatus = res.status;
            let outputToShow = res.output;

            if (finalStatus === 'success') {
                if (compareOutput(res.output, tc.output)) {
                    finalStatus = 'accepted';
                } else {
                    finalStatus = 'wrong_answer';
                }
            }

            testResult.push({
                testCaseOrder: tc.order,
                status: finalStatus,
                executionTime: res.executionTime,
                memoryUsed: 0, 
                output: outputToShow,
            });

            if (finalStatus === 'accepted') {
                passedTests++;
            } else if (overallStatus === 'accepted') {
                overallStatus = finalStatus;
            }

            if (res.executionTime > maxTime) maxTime = res.executionTime;
        }

        // 6. Dọn dẹp file
        try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            if (exePath && fs.existsSync(exePath)) fs.unlinkSync(exePath);
        } catch (e) {
            console.error('Error cleaning up temp files:', e);
        }

        return {
            status: overallStatus,
            testResult,
            timeUsed: maxTime,
            memoryUsed: 0,
            passedTests,
            totalTests: normalizedTestCases.length,
        };
    } catch (err) {
        console.error('System error during local execution:', err);
        return {
            status: 'runtime_error',
            testResult: [{ testCaseOrder: 1, status: 'runtime_error', output: err.message }],
            timeUsed: 0,
            memoryUsed: 0,
            passedTests: 0,
            totalTests: normalizedTestCases.length,
        };
    }
};

module.exports = { runCode };