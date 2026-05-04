import Editor from "@monaco-editor/react";
import { useState } from "react";

const LANGUAGES = ["Python 3", "JavaScript", "Java", "C++", "Go"];

export default function CodeEditor() {
  const [lang, setLang] = useState("Python 3");

  const monacoLang: Record<string, string> = {
    "Python 3": "python",
    "JavaScript": "javascript",
    "Java": "java",
    "C++": "cpp",
    "Go": "go",
  };

  return (
    <section className="flex flex-col h-full bg-[#1e2130] rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/15 transition-colors">
            <span className="text-white text-xs font-semibold">{lang}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
            AUTO-SAVE ON
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"></path>
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-colors">
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
          language={monacoLang[lang]}
          theme="vs-dark"
          defaultValue={'class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n\n        for i, num in enumerate(nums):\n            if target - num in seen:\n                return [seen[target - num], i]\n            seen[num] = i\n\n        return [-1, -1]'}
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

      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-[#1a1d2b]">
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline><polyline points="7 18 1 12 7 6"></polyline>
            </svg>
            Previous
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-semibold">
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline><polyline points="17 18 23 12 17 6"></polyline>
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors">
            Run Code
          </button>
          <button
            className="px-5 py-1.5 rounded-lg text-white font-bold text-xs transition-colors"
            style={{ backgroundColor: "var(--main-orange-color)" }}
          >
            Submit
          </button>
        </div>
      </div>
    </section>
  );
}
