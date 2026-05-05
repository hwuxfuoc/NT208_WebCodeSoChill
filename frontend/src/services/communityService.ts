// frontend/src/services/communityService.ts
import api from './api';

export const getPosts = () => {
  return api.get('/api/community/posts');
};

export const createPost = (data: any) => {
  return api.post('/api/community/posts', data);
};

export const likePost = (id: string) => {
  return api.post(`/api/community/posts/${id}/like`);
};

export const getComments = (id: string) => {
  return api.get(`/api/community/posts/${id}/comments`);
};

export const addComment = (id: string, data: any) => {
  return api.post(`/api/community/posts/${id}/comments`, data);
};