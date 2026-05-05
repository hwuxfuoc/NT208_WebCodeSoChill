//frontend/src/pages/ProfilePage/index.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as profileService from '../../services/profileService';
import UserProfileCard from "./UserProfileCard";
import ActivityHeatmap from "./ActivityHeatmap";
import ContestRating from "./ContestRating";
import SolvedProblems from "./SolvedProblems";
import RecentBadges from "./RecentBadges";
import ContactSocialCard from "./ContactSocialCard";
import RecentSubmissions from "./RecentSubmissions";
import ProfileHeader from "./ProfileHeader";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = !username || username === currentUser?.username;
  const displayUsername = username || currentUser?.username;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!displayUsername) return;
      
      setLoading(true);
      setError(null);
      try {
        const profileRes = await profileService.getProfile(displayUsername);
        const profileData = profileRes.data.user;
        
        const [statsRes, submissionsRes] = await Promise.all([
          profileService.getUserStats(profileData._id),
          profileService.getUserSubmissions(profileData._id, 1, 10),
        ]);

        setProfile(profileData);
        setStats(statsRes.data.stats);
        setSubmissions(submissionsRes.data.submissions);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [displayUsername]);

  if (loading) {
    return (
      <div className="page-stack">
        <div className="page-header">
          <h1>Loading profile...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-stack">
        <div className="page-header">
          <h1>Error: {error}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <ProfileHeader />

      <UserProfileCard user={profile} stats={stats} isOwnProfile={isOwnProfile} />

      <div className="grid grid-cols-2 gap-6">
        <ActivityHeatmap />
        <ContestRating />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SolvedProblems stats={stats} solvedByDifficulty={stats?.solvedByDifficulty} />
        <RecentBadges />
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <RecentSubmissions submissions={submissions} />
        <ContactSocialCard />
      </div>
    </div>
  );
}
