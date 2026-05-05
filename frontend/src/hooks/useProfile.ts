import { useState, useEffect } from 'react';
import * as profileService from '../services/profileService';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes] = await Promise.all([
          profileService.getUserStats(user.id),
        ]);
        setStats(statsRes.data.stats);
        setProfile(user);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return { profile, stats, loading, error };
};

export const useUserProfile = (username: string) => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch profile first
        const profileRes = await profileService.getProfile(username);
        const profileData = profileRes.data.user;
        setProfile(profileData);

        // Then fetch stats and submissions using the profile ID
        const [statsRes, submissionsRes] = await Promise.all([
          profileService.getUserStats(profileData._id),
          profileService.getUserSubmissions(profileData._id, 1, 10),
        ]);
        setStats(statsRes.data.stats);
        setSubmissions(submissionsRes.data.submissions);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { profile, stats, submissions, loading, error };
};

