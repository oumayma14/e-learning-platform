// src/pages/JoinChallenge.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { challengeService } from '../services/challengeService';
import '../Styles/JoinChallenge.css';

const JoinChallenge = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(fetchChallengeStatus, 2000);

    fetchChallengeStatus(); 

    return () => clearInterval(interval);
  }, []);

  const fetchChallengeStatus = async () => {
    try {
      const response = await challengeService.getChallengeStatusByCode(code);
      console.log('Challenge trouvé:', response);
  
      if (response) {
        if (!response.opponent_username) {

          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser && storedUser.username) {
            try {
              await challengeService.joinChallenge(response.id, storedUser.username);
              console.log('Vous avez rejoint le challenge en tant que', storedUser.username);
            } catch (joinError) {
              console.error('Erreur en rejoignant le challenge:', joinError.message);
            }
          }
        }
  
        setChallenge(response);
  
        if (response.opponent_username && response.challenger_username) {
          setReady(true);
        }
      } else {
        console.error('Challenge non trouvé (objet vide)');
        setChallenge(null);
      }
    } catch (error) {
      console.error('Erreur en récupérant le challenge:', error.message);
      setChallenge(null);
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleStartChallenge = () => {
    if (challenge && challenge.quiz_id) {
      navigate(`/dashboard/catalogue/quiz-start/quiz/${challenge.quiz_id}`);
    }
  };
  

  if (loading) {
    return (
      <div className="join-challenge-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!challenge) {
    return <div className="join-challenge-container join-challenge-error">
      Challenge non trouvé ❌
    </div>;
  }

  return (
    <div className="join-challenge-container">
      <h2>🎯 Défi : {challenge.code}</h2>

      <div style={{ margin: '20px 0' }}>
        <p><strong>Créateur:</strong> {challenge.challenger_username}</p>
        <p><strong>Adversaire:</strong> {challenge.opponent_username ? challenge.opponent_username : 'En attente...'}</p>
      </div>

      {ready ? (
        <button className="start-challenge-btn" onClick={handleStartChallenge}>
          🚀 Commencer le Challenge
        </button>
      ) : (
        <div className="join-challenge-loading">
        En attente 
        <div className="dot-flashing"></div>
        </div>
      )}
    </div>
  );
};

export default JoinChallenge;
