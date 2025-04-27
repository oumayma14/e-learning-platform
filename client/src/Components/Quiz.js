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
  const [scoreSent, setScoreSent] = useState(false);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    correctAnswersPoints: 0,
    fastAnswerBonus: 0,
    difficultyBonusPercent: 0,
    finalScore: 0,
  });

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
        questionStartTime.current = Date.now();
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
      finalizeScore();
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
    let pointsEarned = 0;
    let fastBonus = 0;

    if (selectedOption === quiz.questions[currentQuestion].correctAnswer) {
      pointsEarned += 10;

      const timeTaken = (Date.now() - questionStartTime.current) / 1000;
      if (timeTaken <= 5) {
        pointsEarned += 10;
        fastBonus = 10;
      } else if (timeTaken <= 10) {
        pointsEarned += 5;
        fastBonus = 5;
      }
    }

    setScore((prev) => prev + pointsEarned);

    setScoreBreakdown((prev) => ({
      ...prev,
      correctAnswersPoints: prev.correctAnswersPoints + (pointsEarned - fastBonus),
      fastAnswerBonus: prev.fastAnswerBonus + fastBonus,
    }));

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
      const baseScore = score;
      const multiplier = getDifficultyMultiplier(quiz.difficulty);
      const finalScore = Math.round(baseScore * multiplier);

      setScoreBreakdown((prev) => ({
        ...prev,
        difficultyBonusPercent: (multiplier - 1) * 100,
        finalScore: finalScore,
      }));

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.username) {
        console.error('User not found');
        return;
      }

      await submitQuizScore(id, user.username, finalScore);

      const updatedUser = { ...user, score: (user.score || 0) + finalScore };
      setUser(updatedUser);

      console.log('Score envoyé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du score:', error.message);
    }
  };

  const getDifficultyMultiplier = (difficulty) => {
    if (difficulty === "Intermédiaire") return 1.10;
    if (difficulty === "Avancé") return 1.20;
    return 1;
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
              <h3>Détail du Score :</h3>
              <ul className="uq-score-breakdown">
                <li>Réponses Correctes : +{scoreBreakdown.correctAnswersPoints} pts</li>
                <li>Bonus Rapidité : +{scoreBreakdown.fastAnswerBonus} pts</li>
                <li>Bonus Difficulté ({quiz.difficulty}) : +{scoreBreakdown.difficultyBonusPercent}%</li>
              </ul>
              <h2>Total Final : {scoreBreakdown.finalScore} pts</h2>
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
