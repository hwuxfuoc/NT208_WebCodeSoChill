import { useEffect, useState } from "react";
import { Contest } from "../../services/contestService";
import * as contestService from "../../services/contestService";

import ModalPortal from "../../components/ModalPortal";

interface ContestArchiveModalProps {
  onClose: () => void;
  onViewProblems: (contest: Contest) => void;
  onViewRankings: (contest: Contest) => void;
}

export default function ContestArchiveModal({ onClose, onViewProblems, onViewRankings }: ContestArchiveModalProps) {
  const [archive, setArchive] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchive();
  }, []);

  const fetchArchive = async () => {
    try {
      setLoading(true);
      const res = await contestService.getContests();
      const contests = res?.data?.contests || [];
      const past = contests
        .filter((c) => c.status === "ended")
        .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
      setArchive(past);
    } catch (err) {
      console.error("Failed to fetch contest archive", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative flex flex-col"
        style={{ maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors z-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="px-8 pt-8 pb-5 flex-shrink-0 border-b border-gray-100">
          <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--main-orange-color)" }}>Contest Archive</span>
          <h2 className="text-xl font-extrabold text-[#1A1D2B] mt-1">All Past Contests</h2>
          <p className="text-xs text-gray-400 mt-1">{archive.length} contests · Sorted by most recent</p>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
          {loading ? (
            <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div></div>
          ) : (
            archive.map((c, idx) => {
              const dateStr = c.endTime ? new Date(c.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "";
              return (
                <div
                  key={c._id}
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#f8fafc] border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <span className="text-[10px] font-black text-gray-400 tracking-wider w-10 flex-shrink-0">
                    #{archive.length - idx}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#1A1D2B] truncate">
                      {c.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-gray-400 font-medium">{dateStr}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-[10px] text-gray-400 font-medium">{c.participants ? c.participants.length : 0} participants</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onViewProblems(c)}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-colors"
                    >
                      Problems
                    </button>
                    <button
                      onClick={() => onViewRankings(c)}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg text-white hover:opacity-85 transition-opacity"
                      style={{ backgroundColor: "var(--main-orange-color)" }}
                    >
                      Rankings
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
