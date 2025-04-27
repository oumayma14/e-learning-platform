import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, submitQuizScore } from '../services/quizService';
import { useAuth } from '../context/AuthContext';
import '../Styles/Quiz.css';

function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [error, setError] = useState(null);
  const [quizTimeLeft, setQuizTimeLeft] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [scoreSent, setScoreSent] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  const { user, setUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const quizTimerRef = useRef(null);
  const questionStartTime = useRef(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getQuizById(id);
        const rawQuiz = response.data;

        const transformedQuiz = {
          title: rawQuiz.title,
          difficulty: rawQuiz.difficulty,
          timeLimit: rawQuiz.time_limit,
          questions: rawQuiz.questions.map((q) => ({
            question: q.question_text,
            options: q.options.map((opt) => opt.option_text),
            correctAnswer: q.options.findIndex((opt) => opt.is_correct === 1),
          })),
        };

        setQuiz(transformedQuiz);
        setQuizTimeLeft(transformedQuiz.timeLimit);
        questionStartTime.current = Date.now();
      } catch (err) {
        setError('Échec de la récupération des données du quiz');
        navigate('/');
      }
    };

    fetchQuizData();
    return () => clearInterval(quizTimerRef.current);
  }, [id, navigate]);

  useEffect(() => {
    if (quiz) {
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
    }
    return () => clearInterval(quizTimerRef.current);
  }, [quiz]);

  useEffect(() => {
    if (showScore && !scoreSent) {
      finalizeScore();
      setScoreSent(true);
    }
  }, [showScore, scoreSent]);

  const handleOptionSelect = (index) => setSelectedOption(index);

  const handleNextQuestion = () => {
    let pointsEarned = 0;
    if (selectedOption === quiz.questions[currentQuestion].correctAnswer) {
      const timeTaken = (Date.now() - questionStartTime.current) / 1000;
      pointsEarned += 10;
      if (timeTaken <= 5) pointsEarned += 10;
      else if (timeTaken <= 10) pointsEarned += 5;
    }

    setScore(prev => prev + pointsEarned);
    setSelectedOption(null);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quiz.questions.length) {
      setCurrentQuestion(nextQuestion);
      questionStartTime.current = Date.now();
    } else {
      setShowScore(true);
    }
  };

  const handleTimeUp = () => {
    setIsTimeUp(true);
    setShowScore(true);
  };


  const finalizeScore = async () => {
    try {
      const multiplier = getDifficultyMultiplier(quiz.difficulty);
      const finalScore = Math.round(score * multiplier);

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.username) return;

      await submitQuizScore(id, user.username, finalScore);
      const updatedUser = { ...user, score: (user.score || 0) + finalScore };
      setUser(updatedUser);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score:', error.message);
    }
  };

  const getDifficultyMultiplier = (difficulty) => {
    if (difficulty === 'Intermédiaire') return 1.1;
    if (difficulty === 'Avancé') return 1.2;
    return 1;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (error) return <div className="uq-loading">Erreur : {error}</div>;
  if (!quiz) return <div className="uq-loading"><div className="uq-spinner"></div>Chargement...</div>;

  return (
    <div className="uq-container">
      {showScore ? (
  <div className="uq-complete-container">
    <div className="uq-complete-card">
      <h2>
        {isTimeUp ? '⏰ Temps écoulé !' : (score >= quiz.questions.length * 10 * 0.7 ? '🎉 Félicitations !' : '👏 Bien tenté !')}
      </h2>

      <p className="uq-quiz-title">{quiz.title}</p>

      {/* Celebration stars if good score */}
      {score >= quiz.questions.length * 10 * 0.7 && (
        <div className="uq-stars">
          <div className="uq-star"></div>
          <div className="uq-star"></div>
          <div className="uq-star"></div>
        </div>
      )}

      <div className="uq-score-display">
        <h3>Ton score final : {score}</h3>
      </div>

      <button className="uq-return-btn" onClick={() => navigate('/dashboard/catalogue/quiz-start')}>
        Rejouer ou Explorer plus de quiz
      </button>
    </div>
  </div>
) :  (
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
                <span className={`uq-timer-value ${quizTimeLeft <= 30 ? 'low-time' : ''}`}>{formatTime(quizTimeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="uq-progress-bar">
            <div className="uq-progress-fill" style={{ width: `${((currentQuestion) / quiz.questions.length) * 100}%` }}></div>
          </div>

          <div className="uq-question-box">
            <div className="uq-question-text">{quiz.questions[currentQuestion].question}</div>
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
              {currentQuestion + 1 === quiz.questions.length ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
