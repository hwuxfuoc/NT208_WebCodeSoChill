import { useState, useEffect } from "react";
import ContestRegisterModal from "./ContestRegisterModal";
import ViewProblemsModal from "./ViewProblemsModal";
import ContestRankingsModal from "./ContestRankingsModal";
import ContestArchiveModal from "./ContestArchiveModal";
import CurrentContest from "./CurrentContest";
import UpcomingContestsTable from "./UpcomingContestsTable";
import RecentContestsGrid from "./RecentContestsGrid";
import * as contestService from "../../services/contestService";
import { Contest } from "../../services/contestService";

export default function ContestPage() {
  const [activeModal, setActiveModal] = useState<"register" | "view_problems" | "rankings" | "archive" | null>(null);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await contestService.getContests();
      setContests(res.data.contests);
    } catch (err) {
      console.error("Failed to fetch contests", err);
    } finally {
      setLoading(false);
    }
  };

  const ongoingContests = contests.filter(c => c.status === "ongoing");
  const upcomingContests = contests.filter(c => c.status === "upcoming");
  const pastContests = contests.filter(c => c.status === "ended");

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1>Contest</h1>
        <div className="search-bar-container">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--main-orange-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search contest..." />
        </div>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
      ) : (
        <>
          {ongoingContests.length > 0 && (
            <CurrentContest 
              contest={ongoingContests[0]}
              onEnter={(contest) => {
                setSelectedContest(contest);
                setActiveModal("register");
              }}
              onViewProblems={(contest) => {
                setSelectedContest(contest);
                setActiveModal("view_problems");
              }}
            />
          )}

          <UpcomingContestsTable 
            contests={upcomingContests}
            onRegister={(contest) => {
              setSelectedContest(contest);
              setActiveModal("register");
            }}
          />

          <RecentContestsGrid 
            contests={pastContests.slice(0, 3)}
            onViewArchive={() => setActiveModal("archive")}
            onViewRankings={(contest) => {
              setSelectedContest(contest);
              setActiveModal("rankings");
            }}
          />
        </>
      )}

      {activeModal === "register" && selectedContest && (
        <ContestRegisterModal
          contest={selectedContest}
          onClose={() => { setActiveModal(null); fetchContests(); }}
        />
      )}
      {activeModal === "view_problems" && selectedContest && (
        <ViewProblemsModal
          contest={selectedContest}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "rankings" && selectedContest && (
        <ContestRankingsModal
          contest={selectedContest}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "archive" && (
        <ContestArchiveModal
          onClose={() => setActiveModal(null)}
          onViewProblems={(contest) => {
            setSelectedContest(contest);
            setActiveModal("view_problems");
          }}
          onViewRankings={(contest) => {
            setSelectedContest(contest);
            setActiveModal("rankings");
          }}
        />
      )}
    </div>
  );
}
