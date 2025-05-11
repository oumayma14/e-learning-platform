import apiClient from './apiService';

export const submitFeedback = async (userId, quizId, feedbackText) => {
    try {
        const response = await apiClient.post('/feedback', {
            user_id: userId,
            quiz_id: quizId,
            feedback_text: feedbackText
        });

        return response;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        // Provide a clearer error message for the frontend
        throw new Error(error.response?.data?.message || "Erreur lors de l'envoi du feedback");
    }
};
