//frontend/src/pages/ProblemDetailPage/ProblemDescription.tsx
import { useEffect, useState } from "react";
import { getProblem } from "../../services/problemService";
import { Link } from "react-router-dom";

interface Props {
  id?: string;
  title?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}

const difficultyStyle = {
  Easy: { bg: "var(--main-green-color)", color: "#fff" },
  Medium: { bg: "#FCD34D", color: "#7c5f00" },
  Hard: { bg: "#ef4444", color: "#fff" },
};

export default function ProblemDescription({
  id = "ID-001A",
  title = "Two Sum Re-imagined",
  difficulty = "Easy",
}: Props) {
  const style = difficultyStyle[difficulty];

  return (
    <section className="flex flex-col h-full overflow-y-auto bg-white rounded-2xl shadow-sm">
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <Link
          to="/problems"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-3 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Return to Problems
        </Link>
        <h1 className="text-2xl font-black text-[#1A1D2B] mb-2">Problem Detail</h1>
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            {difficulty}
          </span>
          <span className="text-xs text-gray-400 font-semibold">{id}</span>
        </div>
      </div>

      <div className="px-6 py-5 flex-1 overflow-y-auto text-sm leading-relaxed text-[#1A1D2B]">
        <h2 className="text-lg font-bold mb-3">{title}</h2>
        <p className="text-gray-600 mb-3">
          Given an array of integers <mark className="bg-orange-100 text-orange-600 rounded px-1 font-mono text-xs">nums</mark> and an integer{" "}
          <mark className="bg-orange-100 text-orange-600 rounded px-1 font-mono text-xs">target</mark>, return indices of the two
          numbers such that they add up to target.
        </p>
        <p className="text-gray-600 mb-5">
          In this re-imagined version, you may assume that each input would have{" "}
          <strong>at most</strong> one solution, and you may not use the same element twice. If no
          solution exists, return{" "}
          <mark className="bg-orange-100 text-orange-600 rounded px-1 font-mono text-xs">[-1, -1]</mark>.
        </p>

        <div className="mb-4">
          <p className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full" style={{ backgroundColor: "var(--main-orange-color)" }}></span>
            Example 1
          </p>
          <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-700 border border-gray-100">
            <p><span className="text-gray-500">Input:</span> nums = [2,7,11,15], target = 9</p>
            <p><span className="text-gray-500">Output:</span> [0,1]</p>
            <p className="mt-1 text-gray-400"><span className="text-gray-500">Explanation:</span> Because nums[0] + nums[1] == 9, we return [0, 1].</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full" style={{ backgroundColor: "var(--main-orange-color)" }}></span>
            Example 2
          </p>
          <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-700 border border-gray-100">
            <p><span className="text-gray-500">Input:</span> nums = [3,2,4], target = 6</p>
            <p><span className="text-gray-500">Output:</span> [1,2]</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-700 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Constraints
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600 font-mono">
            {["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹"].map((c) => (
              <li key={c} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--main-green-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                {c}
              </li>
            ))}
            <li className="flex items-center gap-2 font-semibold" style={{ color: "var(--main-orange-color)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Time Complexity: O(n) preferred
            </li>
          </ul>
        </div>

        <div>
          <p className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-700 mb-3">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Video Tutorial
            </span>
            <span className="bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-full tracking-wider">NEW</span>
          </p>
          <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video cursor-pointer group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 text-white">
              <p className="text-sm font-bold">Optimizing Hash Maps</p>
              <p className="text-xs text-white/70">12:45 · Architectural Pulse Team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
