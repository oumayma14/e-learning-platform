import axios from "axios";
import { getFormateurToken } from './formateurService';

const API_BASE_URL = 'http://localhost:3002/api/quizzes';

const URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3002/api';

export const QUIZ_API_URL = `${URL}/quizzes`;

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


const API_URL = 'http://localhost:3002/api/quizzes/full'; 

export const createFullQuiz = async (quizData) => {
    try {
      const response = await axios.post(API_URL, quizData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const submitQuizScore = async (quizId, username, score) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${quizId}/submit`, {
        username,
        score
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  


  export const getQuizzesByFormateur = async () => {
    try {
      const token = getFormateurToken();
      const response = await fetch(`${API_BASE_URL}/formateur/quizzes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des quizzes du formateur');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  