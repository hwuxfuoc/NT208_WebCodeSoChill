import api from "./api";

export interface Contest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  participants: string[];
  status: "upcoming" | "ongoing" | "ended";
  ratedFor: string;
  isRated: boolean;
  createdBy: {
    _id: string;
    username: string;
    displayname: string;
  };
}

export const getContests = () => {
  return api.get<{ contests: Contest[] }>("/api/contests");
};

export const getContest = (id: string) => {
  return api.get<{ contest: Contest }>(`/api/contests/${id}`);
};

export const getContestProblems = (id: string) => {
  return api.get(`/api/contests/${id}/problems`);
};

export const getContestLeaderboard = (id: string) => {
  return api.get(`/api/contests/${id}/leaderboard`);
};

export const registerContest = (id: string) => {
  return api.post(`/api/contests/${id}/register`);
};
