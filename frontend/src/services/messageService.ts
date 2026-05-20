import api from "./api";

export const getConversations = () => {
  return api.get('/api/messages/conversations');
};

export const getMessages = (conversationId: string) => {
  return api.get(`/api/messages/${conversationId}`);
};

export const createConversation = (participantId: string) => {
  return api.post('/api/messages', { participantId });
};

export const sendMessage = (conversationId: string, payload: any) => {
  return api.post(`/api/messages/${conversationId}`, payload);
};

export const searchUsers = (query: string) => {
  return api.get('/api/users/search', { params: { q: query } });
};
