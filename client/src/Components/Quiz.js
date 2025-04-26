import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/Quiz.css';
import { getQuizById, submitQuizScore } from '../services/quizService';
import { useAuth } from '../context/AuthContext';



function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [error, setError] = useState(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const quizTimerRef = useRef(null);
  const [scoreSent, setScoreSent] = useState(false);
  const { user, setUser } = useAuth();

  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getQuizById(id);
        const rawQuiz = response.data;

        const transformedQuiz = {
          title: rawQuiz.title,
          timeLimit: rawQuiz.time_limit, 
          questions: rawQuiz.questions.map((q) => {
            const options = q.options.map((opt) => opt.option_text);
            const correctAnswerIndex = q.options.findIndex((opt) => opt.is_correct === 1);
            return {
              question: q.question_text,
              options,
              correctAnswer: correctAnswerIndex,
            };
          }),
        };

        setQuiz(transformedQuiz);
        setQuizTimeLeft(transformedQuiz.timeLimit);
        
      } catch (err) {
        setError('Échec de la récupération des données du quiz');
        navigate('/');
      }
    };

    fetchQuizData();
    return () => {
      clearInterval(quizTimerRef.current);
    };
  }, [id, navigate]);

  useEffect(() => {
    if (showScore && !scoreSent) {
      submitScore();
      setScoreSent(true);
    }
  }, [showScore, scoreSent]);
  

  useEffect(() => {
    if (!quiz) return;
  
    quizTimerRef.current = setInterval(() => {
      setQuizTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(quizTimerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(quizTimerRef.current);
  }, [quiz]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setSelectedOption(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quiz.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setShowScore(true);
  };

  const submitScore = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.username) {
        console.error('User not found in localStorage');
        return;
      }
  
      const percentageScore = Math.round((score / quiz.questions.length) * 100);
  
      await submitQuizScore(id, user.username, percentageScore);
      const updatedUser = { ...user, score: (user.score || 0) + percentageScore };
      setUser(updatedUser); 
  
  
      console.log('Score envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score:', error.message);
    }
  };
  
  
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (error) return <div className="uq-loading">Erreur : {error}</div>;
  if (!quiz) return (
    <div className="uq-loading">
      <div className="uq-spinner"></div>
      Chargement...
    </div>
  );

  return (
    <div className="uq-container">
      {showScore ? (
        <div className="uq-complete-container">
          <div className="uq-complete-card">
            <div className="uq-complete-header">
              <h2>{isTimeUp ? 'Temps écoulé !' : 'Quiz terminé !'}</h2>
              <p className="uq-quiz-title">{quiz.title}</p>
            </div>
            
            <div className="uq-score-display">
              <div className="uq-circular-progress">
                <svg className="uq-progress-ring" viewBox="0 0 36 36">
                  <path
                    className="uq-progress-ring-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="uq-progress-ring-fill"
                    strokeDasharray={`${(score / quiz.questions.length) * 100}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="uq-score-percentage">
                  <span>{Math.round((score / quiz.questions.length) * 100)}%</span>
                  <div className="uq-score-text">Score</div>
                </div>
              </div>
            </div>

            <div className="uq-score-details">
              <div className="uq-score-detail">
                Réponses correctes : <strong>{score}</strong> sur <strong>{quiz.questions.length}</strong>
              </div>
            </div>

            <button 
              className="uq-return-btn"
              onClick={() => navigate('/dashboard/catalogue/quiz-start')}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      ) : (
        <>
        <div className="uq-header">
          <div className="uq-info">
            <h1>{quiz.title}</h1>
            <div className="uq-counter">
              Question {currentQuestion + 1} sur {quiz.questions.length}
            </div>
          </div>
          <div className="uq-timers">
            <div className="uq-timer">
              <span className="uq-timer-label">Temps restant :</span>
              <span className={`uq-timer-value ${quizTimeLeft <= 30 ? 'low-time' : ''}`}>
                {formatTime(quizTimeLeft)}
              </span>
            </div>
          </div>
        </div>

          <div className="uq-progress-bar">
            <div 
              className="uq-progress-fill" 
              style={{ width: `${((currentQuestion) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="uq-question-box">
            <div className="uq-question-text">
              {quiz.questions[currentQuestion].question}
            </div>
          </div>

          <div className="uq-options">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`uq-option-btn ${selectedOption === index ? 'uq-selected' : ''}`}
                onClick={() => handleOptionSelect(index)}
              >
                <div className="uq-letter">{String.fromCharCode(65 + index)}</div>
                <div className="uq-text">{option}</div>
              </button>
            ))}
          </div>

          <div className="uq-footer">
            <button
              className={`uq-submit-btn ${selectedOption === null ? 'uq-disabled' : ''}`}
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
            >
              {currentQuestion + 1 === quiz.questions.length ? 'Terminer le quiz' : 'Question suivante'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;