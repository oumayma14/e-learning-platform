import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/Quiz.css';

const quizData = {
  1: {
    title: "JavaScript Basics",
    questions: [
      {
        id: 1,
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["variable x;", "let x;", "x = var;", "declare x;"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "Which of these is NOT a JavaScript data type?",
        options: ["Number", "String", "Boolean", "Float"],
        correctAnswer: 3
      },
      {
        id: 3,
        question: "What does 'DOM' stand for?",
        options: [
          "Document Object Model",
          "Data Object Management",
          "Digital Output Module",
          "Display Object Manager"
        ],
        correctAnswer: 0
      }
    ]
  },
  2: {
    title: "React Advanced",
    questions: [
      {
        id: 1,
        question: "Which hook is used for side effects in React?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What is the purpose of useMemo?",
        options: [
          "To manage state",
          "To optimize performance by memoizing values",
          "To handle side effects",
          "To create memo components"
        ],
        correctAnswer: 1
      }
    ]
  }
};

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quiz, setQuiz] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const selectedQuiz = quizData[id];
    if (selectedQuiz) {
      setQuiz(selectedQuiz);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && quiz) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setQuizCompleted(true);
    }
  }, [timeLeft, quizCompleted, quiz]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === quiz.questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!quiz) {
    return (
      <div className="uq-loading">
        <div className="uq-spinner"></div>
        <p>Loading your quiz...</p>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const showConfetti = percentage >= 50;
    
    const confetti = showConfetti ? Array.from({ length: 80 }).map((_, i) => (
      <div 
        key={i}
        className="uq-confetti"
        style={{
          left: `${Math.random() * 100}%`,
          background: `hsl(${Math.random() * 360}, 100%, 50%)`,
          animationDuration: `${2 + Math.random() * 3}s`,
          animationDelay: `${Math.random() * 0.5}s`,
          width: `${6 + Math.random() * 8}px`,
          height: `${6 + Math.random() * 8}px`,
          opacity: 0.8,
        }}
      />
    )) : null;

    return (
      <div className="uq-complete-container">
        {confetti}
        <div className="uq-complete-card">
          <div className="uq-complete-header">
            <h2>Quiz Completed!</h2>
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
                  strokeDasharray={`${percentage}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="uq-score-percentage">
                <span>{percentage}%</span>
                <div className="uq-score-text">Score</div>
              </div>
            </div>

            <div className="uq-score-details">
              <div className="uq-score-detail">
                <span>{score} Correct</span>
              </div>
              <div className="uq-score-detail">
                <span>{quiz.questions.length - score} Incorrect</span>
              </div>
              <div className="uq-score-detail">
                <span>{formatTime(300 - timeLeft)} Time</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/dashboard/catalogue/quiz-start')} 
            className="uq-return-btn"
          >
            Back to Quiz List
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / quiz.questions.length) * 100;

  return (
    <div className="uq-container">
      <div className="uq-header">
        <div className="uq-info">
          <h1>{quiz.title}</h1>
          <div className="uq-counter">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>

        <div className="uq-timer">
          <span className="uq-time-text">{formatTime(timeLeft)} remaining</span>
          <div className="uq-time-bar">
            <div className="uq-time-fill" style={{ width: `${(timeLeft / 300) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="uq-progress-bar">
        <div className="uq-progress-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div className="uq-question-box">
        <h2 className="uq-question-text">{currentQuestion.question}</h2>

        <div className="uq-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`uq-option-btn ${
                selectedOption === index ? 'uq-selected' : ''
              } ${
                showFeedback && index === currentQuestion.correctAnswer ? 'uq-correct' : ''
              } ${
                showFeedback && selectedOption === index && !isCorrect ? 'uq-incorrect' : ''
              }`}
              onClick={() => handleOptionSelect(index)}
              disabled={showFeedback}
            >
              <span className="uq-letter">{String.fromCharCode(65 + index)}</span>
              <span className="uq-text">{option}</span>
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`uq-feedback ${isCorrect ? 'uq-feedback-correct' : 'uq-feedback-incorrect'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Incorrect!'}
          </div>
        )}
      </div>

      <div className="uq-footer">
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || showFeedback}
          className={`uq-submit-btn ${
            selectedOption === null || showFeedback ? 'uq-disabled' : ''
          }`}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Submit Answer' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
}