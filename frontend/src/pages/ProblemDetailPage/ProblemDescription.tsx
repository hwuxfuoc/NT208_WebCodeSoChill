import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { chatStream } from "../../services/aiService";

interface Sample {
  input: string;
  output: string;
  explanation: string;
}

interface Props {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  constraints: string;
  samples: Sample[];
  tags: string[];
  topics: string[];
  timeLimit: number;
  memoryLimit: number;
  problemId: string;
  currentCode?: string;
  lastSubmissionStatus?: string | null;
}

const difficultyStyle = {
  Easy: { bg: "var(--main-green-color)", color: "#fff" },
  Medium: { bg: "#FCD34D", color: "#7c5f00" },
  Hard: { bg: "#ef4444", color: "#fff" },
};

export default function ProblemDescription({
  id,
  title,
  difficulty,
  description,
  constraints,
  samples,
  tags,
  timeLimit,
  memoryLimit,
  problemId,
  currentCode,
  lastSubmissionStatus,
}: Props) {
  const style = difficultyStyle[difficulty];
  const [hintText, setHintText] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const abortRef = useRef(false);

  const handleAskAI = async () => {
    setHintText("");
    setHintError(null);
    setHintVisible(true);
    setHintLoading(true);
    abortRef.current = false;

    await chatStream({
      question: "Phân tích code hiện tại của tôi và đưa ra gợi ý hướng đi phù hợp nhất, không tiết lộ lời giải hoàn chỉnh.",
      problemId,
      problemTitle: title,
      problemDescription: description,
      problemDifficulty: difficulty,
      userCode: currentCode || "",
      lastSubmissionStatus: lastSubmissionStatus ?? null,
      onChunk: (chunk) => {
        if (!abortRef.current) {
          setHintText((prev) => prev + chunk);
        }
      },
      onError: (error) => {
        if (!abortRef.current) {
          setHintError(error);
          setHintLoading(false);
        }
      },
      onComplete: () => {
        if (!abortRef.current) {
          setHintLoading(false);
        }
      },
    });
  };

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
        <h1 className="text-2xl font-black text-[#1A1D2B] mb-2">{title}</h1>
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            {difficulty}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <span>Time: {timeLimit}ms</span>
          <span>Memory: {memoryLimit}MB</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 flex-1 overflow-y-auto text-sm leading-relaxed text-[#1A1D2B]">
        <div className="text-gray-600 mb-5" dangerouslySetInnerHTML={{ __html: description }} />

        {samples.map((sample, index) => (
          <div key={index} className="mb-4">
            <p className="text-xs font-black uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full" style={{ backgroundColor: "var(--main-orange-color)" }}></span>
              Example {index + 1}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-700 border border-gray-100">
              <p><span className="text-gray-500">Input:</span> {sample.input}</p>
              <p><span className="text-gray-500">Output:</span> {sample.output}</p>
              {sample.explanation && (
                <p className="mt-1 text-gray-400"><span className="text-gray-500">Explanation:</span> {sample.explanation}</p>
              )}
            </div>
          </div>
        ))}

        {constraints && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-700 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Constraints
            </p>
            <div className="text-xs text-gray-600 font-mono" dangerouslySetInnerHTML={{ __html: constraints }} />
          </div>
        )}

        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-700 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--main-orange-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            AI Hint
            <span
              className="ml-auto text-[9px] px-2 py-0.5 rounded-full tracking-wider font-bold"
              style={{ backgroundColor: "color-mix(in srgb, var(--main-orange-color) 15%, white)", color: "var(--main-orange-color)" }}
            >BETA</span>
          </p>

          <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{
              border: "1.5px dashed color-mix(in srgb, var(--main-orange-color) 35%, white)",
              background: "linear-gradient(135deg, color-mix(in srgb, var(--main-orange-color) 8%, white) 0%, white 100%)",
            }}
          >
            {!hintVisible && (
              <>
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--main-orange-color)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-800 mb-0.5">Get a hint from AI</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      The AI will analyze your current code and suggest a direction — without giving away the full answer.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["Analyze your code", "Step-by-step hint", "No spoilers"].map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--main-orange-color) 15%, white)",
                        color: "var(--main-orange-color)",
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}

            {hintVisible && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-black uppercase tracking-wider" style={{ color: "var(--main-orange-color)" }}>
                    AI Hint
                  </p>
                  {hintLoading && (
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--main-orange-color)" }}></span>
                      Thinking...
                    </span>
                  )}
                  {!hintLoading && (
                    <button
                      onClick={() => { setHintVisible(false); setHintText(""); setHintError(null); }}
                      className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Hide
                    </button>
                  )}
                </div>

                {hintError && (
                  <div className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">
                    {hintError}
                  </div>
                )}

                {hintText && (
                  <div
                    className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap bg-white rounded-xl px-4 py-3 border border-gray-100"
                    style={{ maxHeight: "280px", overflowY: "auto" }}
                  >
                    {hintText}
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleAskAI}
              disabled={hintLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors disabled:opacity-60"
              style={{ background: "var(--main-orange-color)", color: "#fff" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              {hintLoading ? "Analyzing..." : hintVisible ? "Ask Again" : "Ask AI for a Hint"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
