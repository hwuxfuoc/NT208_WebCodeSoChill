import { useState } from "react";
import ContestRegisterModal from "./ContestRegisterModal";
import ViewProblemsModal from "./ViewProblemsModal";
import ContestRankingsModal from "./ContestRankingsModal";
import ContestArchiveModal from "./ContestArchiveModal";
import CurrentContest from "./CurrentContest";
import UpcomingContestsTable from "./UpcomingContestsTable";
import RecentContestsGrid from "./RecentContestsGrid";

export default function ContestPage() {
  const [activeModal, setActiveModal] = useState<"register" | "view_problems" | "rankings" | "archive" | null>(null);
  const [selectedContest, setSelectedContest] = useState("");
  const [isLiveContest, setIsLiveContest] = useState(false);
  const [contestStartTime, setContestStartTime] = useState("");
  const [contestDate, setContestDate] = useState("");
  const [contestTotalSolved, setContestTotalSolved] = useState("");
  const [isPastContest, setIsPastContest] = useState(false);

  const upcomingContests = [
    { name: "Spring Microservices Sprint", startDate: "Oct 24, 2023", startTime: "18:00 UTC", duration: "2.5 hrs", participants: "+842" },
    { name: "Rust Memory Safety Duel",     startDate: "Oct 26, 2023", startTime: "04:00 UTC", duration: "1.5 hrs", participants: "+1.2k" },
  ];

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1>Contest</h1>
        <div className="search-bar-container">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--main-orange-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search contest..." />
        </div>
      </div>

      <CurrentContest 
        onEnter={() => {
          setSelectedContest("CodeSoChill Biweekly Architectural Challenge #42");
          setIsLiveContest(true);
          setContestStartTime("");
          setActiveModal("register");
        }}
        onViewProblems={() => {
          setSelectedContest("CodeSoChill Biweekly Architectural Challenge #42");
          setActiveModal("view_problems");
        }}
      />

      <UpcomingContestsTable 
        contests={upcomingContests}
        onRegister={(c) => {
          setSelectedContest(c.name);
          setIsLiveContest(false);
          setContestStartTime(`${c.startDate} at ${c.startTime}`);
          setActiveModal("register");
        }}
      />

      <RecentContestsGrid 
        onViewArchive={() => setActiveModal("archive")}
        onViewRankings={(c) => {
          setSelectedContest(c.title);
          setContestDate(c.date);
          setContestTotalSolved(c.solved);
          setActiveModal("rankings");
        }}
      />

      {activeModal === "register" && (
        <ContestRegisterModal
          contestName={selectedContest}
          isLive={isLiveContest}
          startTime={contestStartTime}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "view_problems" && (
        <ViewProblemsModal
          contestName={selectedContest}
          isPastContest={isPastContest}
          onClose={() => { setActiveModal(null); setIsPastContest(false); }}
        />
      )}
      {activeModal === "rankings" && (
        <ContestRankingsModal
          contestName={selectedContest}
          contestDate={contestDate}
          totalSolved={contestTotalSolved}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "archive" && (
        <ContestArchiveModal
          onClose={() => setActiveModal(null)}
          onViewProblems={(name, date, solved) => {
            setSelectedContest(name);
            setContestDate(date);
            setContestTotalSolved(solved);
            setIsPastContest(true);
            setActiveModal("view_problems");
          }}
          onViewRankings={(name, date, solved) => {
            setSelectedContest(name);
            setContestDate(date);
            setContestTotalSolved(solved);
            setActiveModal("rankings");
          }}
        />
      )}
    </div>
  );
}
