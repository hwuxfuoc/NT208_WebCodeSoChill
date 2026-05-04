import type { TabType } from "./index";

interface ProblemSearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  tab: TabType;
  setTab: (t: TabType) => void;
  setPage: (p: number) => void;
}

export default function ProblemSearchBar({ query, setQuery, tab, setTab, setPage }: ProblemSearchBarProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1">
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Search problem..."
          className="w-full bg-[#f4f6f8] text-[13px] text-gray-700 rounded-xl pl-10 pr-4 py-2.5 outline-none border border-transparent focus:border-orange-400 transition-colors"
        />
      </div>

      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f4f6f8] text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
          <line x1="5" y1="5" x2="19" y2="5"></line>
        </svg>
      </button>

      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f4f6f8] text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>

      <div className="flex items-center bg-[#f4f6f8] rounded-xl p-1 flex-shrink-0">
        {(["all", "solved", "unsolved"] as TabType[]).map((item) => (
          <button
            key={item}
            onClick={() => { setTab(item); setPage(1); }}
            className="px-4 py-1.5 rounded-lg text-[13px] font-bold capitalize transition-colors"
            style={
              tab === item
                ? { backgroundColor: "#1A1D2B", color: "#fff" }
                : { backgroundColor: "transparent", color: "#9ca3af" }
            }
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
