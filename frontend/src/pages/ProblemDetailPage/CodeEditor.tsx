import Editor from "@monaco-editor/react";
import { useMemo, useState } from "react";
import { runSubmission, submitSolution } from "../../services/submissionService";

const LANGUAGE_OPTIONS = [
  { label: "Python 3", value: "python", monaco: "python" },
  { label: "JavaScript", value: "javascript", monaco: "javascript" },
  { label: "TypeScript", value: "typescript", monaco: "typescript" },
  { label: "Java", value: "java", monaco: "java" },
  { label: "C++", value: "cpp", monaco: "cpp" },
  { label: "C#", value: "csharp", monaco: "csharp" },
  { label: "Go", value: "go", monaco: "go" },
  { label: "Rust", value: "rust", monaco: "rust" },
  { label: "Kotlin", value: "kotlin", monaco: "kotlin" },
  { label: "Swift", value: "swift", monaco: "swift" },
  { label: "PHP", value: "php", monaco: "php" },
  { label: "Ruby", value: "ruby", monaco: "ruby" },
];

const DEFAULT_SNIPPETS: Record<string, string> = {
  python: "def solve():\n    pass\n\nif __name__ == '__main__':\n    solve()\n",
  javascript: "function solve() {\n    // write your code here\n}\n\n// Example run\n// console.log(solve());\n",
  typescript: "function solve(): void {\n    // write your code here\n}\n\nsolve();\n",
  java: "public class Solution {\n    public static void main(String[] args) {\n        // write your code here\n    }\n}\n",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    // write your code here\n    return 0;\n}\n",
  csharp: "using System;\nclass Solution {\n    static void Main() {\n        // write your code here\n    }\n}\n",
  go: "package main\nimport \"fmt\"\nfunc main() {\n    // write your code here\n    fmt.Println()\n}\n",
  rust: "fn main() {\n    // write your code here\n}\n",
  kotlin: "fun main() {\n    // write your code here\n}\n",
  swift: "import Foundation\n\nprint(\"Hello, world!\")\n",
  php: "<?php\n// write your code here\n",
  ruby: "# write your code here\n",
};

interface CodeEditorProps {
  problemId: string;
  timeLimit: number;
  memoryLimit: number;
}

interface JudgeResult {
  status: string;
  testResult: Array<{ testCaseOrder: number; status: string; executionTime: number; memoryUsed: number; output: string }>;
  timeUsed: number;
  memoryUsed: number;
  passedTests: number;
  totalTests: number;
}

export default function CodeEditor({ problemId }: CodeEditorProps) {
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [code, setCode] = useState(DEFAULT_SNIPPETS[language.value]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<JudgeResult | null>(null);
  const [submitResult, setSubmitResult] = useState<JudgeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const editorLanguage = language.monaco;

  const progressMessage = useMemo(() => {
    if (isRunning) return 'Đang chạy sample test...';
    if (isSubmitting) return 'Đang nộp bài...';
    return null;
  }, [isRunning, isSubmitting]);

  const handleLanguageChange = (value: string) => {
    const selected = LANGUAGE_OPTIONS.find((item) => item.value === value);
    if (!selected) return;
    setLanguage(selected);
    if (!code || code.trim() === DEFAULT_SNIPPETS[language.value]?.trim()) {
      setCode(DEFAULT_SNIPPETS[selected.value] ?? '');
    }
  };

  const handleRun = async () => {
    setErrorMessage(null);
    setRunResult(null);
    setSubmitResult(null);
    setIsRunning(true);

    try {
      const response = await runSubmission({ problemId, language: language.value, code });
      setRunResult(response.data.result);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Lỗi khi chạy code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setSubmitResult(null);
    setRunResult(null);
    setIsSubmitting(true);

    try {
      const response = await submitSolution({ problemId, language: language.value, code });
      const submission = response.data.submission;
      setSubmitResult({
        status: submission.status,
        testResult: submission.testResult || [],
        timeUsed: submission.timeUsed || 0,
        memoryUsed: submission.memoryUsed || 0,
        passedTests: submission.passedTests || 0,
        totalTests: submission.totalTests || 0,
      });
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || 'Lỗi khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const lastResult = submitResult || runResult;

  return (
    <section className="flex flex-col h-full bg-[#1e2130] rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <select
            value={language.value}
            onChange={(event) => handleLanguageChange(event.target.value)}
            className="bg-white/10 text-white text-xs font-semibold px-3 py-2 rounded-lg outline-none border border-white/10"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1e2130] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
            READY TO SUBMIT
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-colors" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"></path>
            </svg>
          </button>
          <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-colors" disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={editorLanguage}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbersMinChars: 3,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
          }}
        />
      </div>

      <div className="px-4 py-3 border-t border-white/10 bg-[#1a1d2b]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
            <span className="px-2 py-1 rounded-lg bg-white/10">Language: {language.label}</span>
            <span className="px-2 py-1 rounded-lg bg-white/10">Run & Submit use Judge0</span>
            {progressMessage && <span className="px-2 py-1 rounded-lg bg-yellow-500/15 text-yellow-300">{progressMessage}</span>}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
              className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Run Code
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isRunning}
              className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-white/80 space-y-3">
          {errorMessage && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-200">
              {errorMessage}
            </div>
          )}

          {lastResult && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs text-white/60">Result</div>
                  <div className="mt-1 text-lg font-semibold text-white">{lastResult.status.replace('_', ' ').toUpperCase()}</div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-white/70">
                  <span className="px-2 py-1 rounded-lg bg-white/10">Passed {lastResult.passedTests}/{lastResult.totalTests}</span>
                  <span className="px-2 py-1 rounded-lg bg-white/10">Time {lastResult.timeUsed}ms</span>
                  <span className="px-2 py-1 rounded-lg bg-white/10">Memory {lastResult.memoryUsed}MB</span>
                </div>
              </div>

              {lastResult.testResult?.length > 0 && (
                <div className="mt-4 grid gap-3">
                  {lastResult.testResult.slice(0, 4).map((item) => (
                    <div key={item.testCaseOrder} className="rounded-xl border border-white/10 bg-[#11151f] p-3 text-xs text-white/80">
                      <div className="flex items-center justify-between gap-2">
                        <span>Test #{item.testCaseOrder}</span>
                        <span className={`rounded-full px-2 py-1 text-[11px] ${item.status === 'accepted' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/60">
                        <span>{item.executionTime} ms</span>
                        <span>{item.memoryUsed} MB</span>
                      </div>
                      {item.output && (
                        <div className="mt-2 break-words text-[12px] text-white/70">
                          Output: {item.output}
                        </div>
                      )}
                    </div>
                  ))}
                  {lastResult.testResult.length > 4 && (
                    <div className="text-[11px] text-white/50">Showing first 4 test results.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
