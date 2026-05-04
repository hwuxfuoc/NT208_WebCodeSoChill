import BannerPromo from "./BannerPromo";
import ContestStatisticChart from "./ContestStatisticChart";
import DailyProblemsChart from "./DailyProblemsChart";
import DailyChallengeCard from "./DailyChallengeCard";
import StatRow from "./StatRow";

export default function HomePage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <h1>Homepage</h1>
      </div>
      <div className="home-grid-top">
        <div className="flex flex-col gap-4">
          <BannerPromo />
          <StatRow />
        </div>
        <ContestStatisticChart />
      </div>
      <div className="home-grid-bottom mt-4">
        <DailyProblemsChart />
        <DailyChallengeCard />
      </div>
    </div>
  );
}
