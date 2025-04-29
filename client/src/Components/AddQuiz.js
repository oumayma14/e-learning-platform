import React, { useState } from 'react';
import { createFullQuiz } from '../services/quizService';
import '../Styles/AddQuiz.css';

const AddQuiz = () => {
  const [step, setStep] = useState(1);
  const [showReview, setShowReview] = useState(false);
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    difficulty: '',
    category: '',
    timeLimit: 30, // Default time in seconds
    questions: [
      {
        questionText: '',
        questionType: 'unique',
        questionOrder: 1,
        options: [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false }
        ],
        correctShortAnswer: ''
      },
    ],
  });

  const difficultyOptions = ['Débutant', 'Intermédiaire', 'Avancé'];
  const categoryOptions = [
    'Géographie', 'Histoire', 'Science', 'Technologie', 'Art', 
    'Musique', 'Cinéma', 'Littérature', 'Sport', 'Divertissement',
    'Culture générale', 'Mathématiques', 'Langues', 'Cuisine'
  ];

  // Navigation handlers
  const goToQuestions = () => {
    if (validateQuizInfo()) {
      setStep(2);
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };

  const goToQuizInfo = () => {
    setStep(1);
  };

  // Data handlers
  const handleQuizInfoChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleTimeLimitChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuizData(prev => ({ ...prev, timeLimit: value }));
  };


  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex][field] = value;
    
    if (field === 'questionType') {
      if (value === 'courte') {
        updatedQuestions[qIndex].options = [];
      } else if (value === 'unique') {
        updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map((opt, i) => ({
          ...opt,
          isCorrect: i === 0
        }));
      }
    }
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    const options = updatedQuestions[qIndex].options;
    
    options[oIndex][field] = value;
    
    if (field === 'isCorrect' && updatedQuestions[qIndex].questionType === 'unique') {
      options.forEach((opt, idx) => {
        opt.isCorrect = idx === oIndex;
      });
    }
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Question management
  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionText: '',
          questionType: 'unique',
          questionOrder: quizData.questions.length + 1,
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false }
          ],
          correctShortAnswer: ''
        },
      ],
    });
  };

  const removeQuestion = (qIndex) => {
    if (quizData.questions.length <= 1) {
      alert('Un quiz doit avoir au moins une question');
      return;
    }
    
    const updatedQuestions = quizData.questions
      .filter((_, index) => index !== qIndex)
      .map((q, index) => ({ ...q, questionOrder: index + 1 }));
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addOption = (qIndex) => {
    if (quizData.questions[qIndex].options.length >= 5) {
      alert('Maximum 5 options par question');
      return;
    }
    
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options.push({ 
      text: '', 
      isCorrect: false 
    });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...quizData.questions];
    const options = updatedQuestions[qIndex].options;
    
    if (options.length <= 2) {
      alert('Chaque question doit avoir au moins deux options');
      return;
    }
    
    options.splice(oIndex, 1);
    
    if (updatedQuestions[qIndex].questionType === 'unique') {
      if (!options.some(opt => opt.isCorrect) && options.length > 0) {
        options[0].isCorrect = true;
      }
    }
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Validation
  const validateQuizInfo = () => {
    return (
      quizData.title.trim() !== '' &&
      quizData.difficulty !== '' &&
      quizData.description.trim() !== '' && 
      quizData.category !== '' &&
      quizData.timeLimit > 0
    );
  };

  const validateQuestions = () => {
    for (const question of quizData.questions) {
      if (!question.questionText.trim()) {
        alert('Toutes les questions doivent avoir du texte');
        return false;
      }

      if (question.questionType === 'courte') {
        if (!question.correctShortAnswer.trim()) {
          alert('Les questions à réponse courte doivent avoir une réponse attendue');
          return false;
        }
      } else {
        if (question.options.length < 2) {
          alert('Chaque question doit avoir au moins deux options');
          return false;
        }
        
        if (!question.options.some(opt => opt.isCorrect)) {
          alert('Chaque question doit avoir au moins une réponse correcte');
          return false;
        }
        
        if (question.options.some(opt => !opt.text.trim())) {
          alert('Toutes les options doivent avoir du texte');
          return false;
        }
      }
    }
    return true;
  };

  // Review and submission
  const handleReview = () => {
    if (validateQuestions()) {
      setShowReview(true);
    }
  };

  const confirmSubmit = async () => {
    setShowReview(false);
    try {
      const submissionData = {
        title: quizData.title,
        description: quizData.description,
        difficulty: quizData.difficulty,
        category: quizData.category,
        timeLimit: quizData.timeLimit,
        questions: quizData.questions.map(question => ({
          questionText: question.questionText,
          questionType: question.questionType,
          timeLimit: question.timeLimit || null,
          questionOrder: question.questionOrder,
          options: question.questionType !== 'courte' 
            ? question.options.map(opt => ({
                text: opt.text,
                isCorrect: opt.isCorrect
              }))
            : [],
          correctShortAnswer: question.questionType === 'courte'
            ? question.correctShortAnswer
            : null
        }))
      };
  
      await createFullQuiz(submissionData);
    } catch (error) {
      console.error("❌ Erreur confirmSubmit:", error.response?.data || error.message);
      alert("Erreur lors de la création du quiz. " + (error.response?.data?.message || ""));
    }
  };
  

  // Format time for display
  const formatTimeForDisplay = (seconds) => {
    return `${seconds} seconde${seconds !== 1 ? 's' : ''}`;};

  // Step 1: Quiz Information
  if (step === 1) {
    return (
      <div className="quiz-form">
        <h2>Informations du Quiz</h2>
        
        <div className="quiz-info-form">
          <div className="form-group">
            <label>Titre du Quiz*</label>
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleQuizInfoChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              value={quizData.description}
              onChange={handleQuizInfoChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Difficulté*</label>
            <select
              name="difficulty"
              value={quizData.difficulty}
              onChange={handleQuizInfoChange}
              required
            >
              <option value="">Sélectionner une difficulté</option>
              {difficultyOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Catégorie*</label>
            <select
              name="category"
              value={quizData.category}
              onChange={handleQuizInfoChange}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categoryOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
            <label>Limite de temps*</label>
            <div className="time-limit-input">
              <input
                type="number"
                name="timeLimit"
                min="1"
                max="7200"
                value={quizData.timeLimit}
                onChange={handleTimeLimitChange}
                className='timer-input'
                required
              />
            </div>
            <small className="time-limit-hint">(1-7200 secondes)</small>
          </div>
        
        <div className="form-navigation">
          <button
            type="button"
            onClick={goToQuestions}
            className="next-button"
          >
            Suivant →
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Questions
  return (
    <div className="quiz-form">
      <h2>Questions du Quiz</h2>
      
      <div className="questions-scroll-container">
        <div className="questions-container">
          {quizData.questions.map((question, qIndex) => (
            <div key={qIndex} className={`question-card ${question.questionType}`}>
              <div className="question-header">
                <h3>Question {qIndex + 1}</h3>
                <div className="question-actions">
                  <select
                    value={question.questionType}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                    className="type-select"
                  >
                    <option value="unique">Réponse unique</option>
                    <option value="multiple">Réponses multiples</option>
                    <option value="courte">Réponse courte</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(qIndex)}
                    className="delete-question"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Intitulé de la question*</label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  required
                />
              </div>

              {question.questionType === 'courte' ? (
                <div className="form-group">
                  <label>Réponse attendue*</label>
                  <input
                    type="text"
                    value={question.correctShortAnswer}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctShortAnswer', e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="options-section">
                  <h4>Options:</h4>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="option-row">
                      <input
                        type={question.questionType === 'multiple' ? 'checkbox' : 'radio'}
                        checked={option.isCorrect}
                        onChange={() => handleOptionChange(qIndex, oIndex, 'isCorrect', !option.isCorrect)}
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="delete-option"
                        disabled={question.options.length <= 2}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="add-option"
                    disabled={question.options.length >= 5}
                  >
                    + Ajouter une option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-navigation">
        <button 
          type="button" 
          onClick={goToQuizInfo}
          className="back-button"
        >
          ← Retour
        </button>
        <button 
          type="button" 
          onClick={addQuestion}
          className="add-question"
        >
          + Ajouter une question
        </button>
        <button 
          type="button" 
          onClick={handleReview}
          className="submit-button"
        >
          Vérifier et soumettre
        </button>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="modal-overlay">
          <div className="review-modal">
            <h2>Vérification du Quiz</h2>
            <h3>{quizData.title}</h3>
            <p><strong style={{color:'#be4d4d'}}>Difficulté:</strong> {quizData.difficulty}</p>
            <p><strong style={{color:'#be4d4d'}}>Catégorie:</strong> {quizData.category}</p>
            {formatTimeForDisplay(quizData.timeLimit)}
            
            <div className="questions-review">
              <h4>Questions:</h4>
              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} className="review-question">
                  <p><strong style={{color:'#be4d4d'}}>Question {qIndex + 1}:</strong> {question.questionText}</p>
                  <p><em>Type: {question.questionType === 'unique' ? 'Réponse unique' : 
                               question.questionType === 'multiple' ? 'Réponses multiples' : 'Réponse courte'}</em></p>
                  
                  {question.questionType === 'courte' ? (
                    <p>Réponse attendue: {question.correctShortAnswer || 'Aucune réponse spécifique'}</p>
                  ) : (
                    <ul>
                      {question.options.map((option, oIndex) => (
                        <li key={oIndex} className={option.isCorrect ? 'correct-answer' : ''}>
                          {option.text} {option.isCorrect && '(Correct)'}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowReview(false)}
                className="edit-button"
              >
                Modifier
              </button>
              <button 
                onClick={confirmSubmit}
                className="confirm-button"
              >
                Confirmer et soumettre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuiz;