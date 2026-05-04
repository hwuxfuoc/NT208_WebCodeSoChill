import UserProfileCard from "./UserProfileCard";
import ActivityHeatmap from "./ActivityHeatmap";
import ContestRating from "./ContestRating";
import SolvedProblems from "./SolvedProblems";
import RecentBadges from "./RecentBadges";
import ContactSocialCard from "./ContactSocialCard";
import RecentSubmissions from "./RecentSubmissions";
import ProfileHeader from "./ProfileHeader";

export default function ProfilePage() {
  return (
    <div className="page-stack">
      <ProfileHeader />

      <UserProfileCard />

      <div className="grid grid-cols-2 gap-6">
        <ActivityHeatmap />
        <ContestRating />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SolvedProblems />
        <RecentBadges />
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <RecentSubmissions />
        <ContactSocialCard />
      </div>
    </div>
  );
}
