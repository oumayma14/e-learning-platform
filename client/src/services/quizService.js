const API_BASE_URL = 'http://localhost:5000/api/quizzes';

export const getQuizzes = async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
    }
    return await response.json();
};

export const getQuizById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch quiz');
    }
    return await response.json();
};

export const createQuiz = async (quizData) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
    });
    if (!response.ok) {
        throw new Error('Failed to create quiz');
    }
    return await response.json();
};

export const updateQuiz = async (id, quizData) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
    });
    if (!response.ok) {
        throw new Error('Failed to update quiz');
    }
    return await response.json();
};

export const deleteQuiz = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete quiz');
    }
    return await response.json();
};

export const addQuestionToQuiz = async (quizId, questionData) => {
    const response = await fetch(`${API_BASE_URL}/${quizId}/questions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
    });
    if (!response.ok) {
        throw new Error('Failed to add question');
    }
    return await response.json();
};