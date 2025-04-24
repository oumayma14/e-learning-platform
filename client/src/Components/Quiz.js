import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById } from '../services/quizService';
import '../Styles/Quiz.css';

function Quiz() {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await getQuizById(id);
        const rawQuiz = response.data;

        const transformedQuiz = {
          title: rawQuiz.title,
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
      } catch (err) {
        setError('Failed to fetch quiz data');
        navigate('/');
      }
    };

    fetchQuizData();
  }, [id, navigate]);

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

  if (error) return <div className="uq-loading">Error: {error}</div>;
  if (!quiz) return (
    <div className="uq-loading">
      <div className="uq-spinner"></div>
      Loading...
    </div>
  );

  return (
    <div className="uq-container">
      {showScore ? (
        <div className="uq-complete-container">
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
                Correct Answers: <strong>{score}</strong> out of <strong>{quiz.questions.length}</strong>
              </div>
            </div>

            <button 
              className="uq-return-btn"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="uq-header">
            <div className="uq-info">
              <h1>{quiz.title}</h1>
              <div className="uq-counter">
                Question {currentQuestion + 1} of {quiz.questions.length}
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
              {currentQuestion + 1 === quiz.questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;