import apiClient from './apiService'; 

export const challengeService = {
  createChallenge: async (quizId, challengerUsername, code) => {
    return await apiClient.post('/api/challenges/create', { quizId, challengerUsername, code });
  },

  joinChallenge: async (challengeId, opponentUsername, opponentScore) => {
    return await apiClient.post(`/api/challenges/join/${challengeId}`, { opponentUsername, opponentScore });
  },

  submitChallengeResult: async (challengeId, username, score) => {
    return await apiClient.post(`/api/challenges/${challengeId}/submit`, { username, score });
  },

  getChallengeStatus: async (challengeId) => {
    return await apiClient.get(`/api/challenges/${challengeId}`);
  },

  getChallengeStatusByCode: async (code) => {
    return await apiClient.get(`/api/challenges/by-code/${code}`);
  }
};
