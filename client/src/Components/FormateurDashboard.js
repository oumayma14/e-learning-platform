import React, { useEffect, useState } from 'react';
import { getQuizzesByFormateur } from '../services/quizService';
import { useNavigate } from 'react-router-dom';

import '../Styles/formateurdashboard.css';

const FormateurDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await getQuizzesByFormateur();
        setQuizzes(data.data || []);
      } catch (error) {
        console.error('Erreur récupération quizzes :', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  return (
    <div className="dashboard-container" style={{ padding: '2rem', color: '#515151' }}>
      <h1 style={{ color: '#be4d4d', textAlign: 'center' }}>Bienvenue Formateur !</h1>

      <button
        onClick={() => navigate('/formateur/dashboard/add-quiz')}
        style={{
          padding: '0.6rem 1.2rem',
          backgroundColor: '#be4d4d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        + Créer un Quiz
      </button>

      <h2 style={{ marginBottom: '1rem' }}>Vos Quizzes</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : quizzes.length === 0 ? (
        <p>Vous n'avez encore créé aucun quiz.</p>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div className="quiz-card" key={quiz.id}>
              <h3>{quiz.title}</h3>
              <p><strong>Difficulté :</strong> {quiz.difficulty}</p>
              <p><strong>Catégorie :</strong> {quiz.category}</p>
              <p><strong>Durée :</strong> {quiz.time_limit} sec</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormateurDashboard;
