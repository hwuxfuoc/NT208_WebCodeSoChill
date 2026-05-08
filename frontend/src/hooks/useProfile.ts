import { useQuery } from '@tanstack/react-query';
import * as profileService from '../services/profileService';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();

  const { data: stats, isPending: statsLoading, error: statsError } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      const statsRes = await profileService.getUserStats(user!.id);
      return statsRes.data.stats;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    profile: user || null,
    stats: stats || null,
    loading: statsLoading,
    error: statsError ? 'Failed to fetch profile' : null,
  };
};

export const useUserProfile = (username: string) => {
  const { data: profile, isPending: profileLoading, error: profileError } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      const profileRes = await profileService.getProfile(username);
      return profileRes.data.user;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: stats, isPending: statsLoading } = useQuery({
    queryKey: ['userStats', profile?._id],
    queryFn: async () => {
      const statsRes = await profileService.getUserStats(profile._id);
      return statsRes.data.stats;
    },
    enabled: !!profile?._id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: submissions, isPending: submissionsLoading } = useQuery({
    queryKey: ['userSubmissions', profile?._id],
    queryFn: async () => {
      const submissionsRes = await profileService.getUserSubmissions(profile._id, 1, 10);
      return submissionsRes.data.submissions;
    },
    enabled: !!profile?._id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    profile: profile || null,
    stats: stats || null,
    submissions: submissions || [],
    loading: profileLoading || statsLoading || submissionsLoading,
    error: profileError ? 'Failed to fetch profile' : null,
  };
};

