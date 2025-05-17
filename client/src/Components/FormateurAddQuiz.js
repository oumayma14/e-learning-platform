import React, { useState } from 'react';
import axios from 'axios';
import { getFormateurToken } from '../services/formateurService';

const difficultyOptions = ['Débutant', 'Intermédiaire', 'Avancé'];
const categoryOptions = [
  'Géographie', 'Histoire', 'Science', 'Technologie', 'Art',
  'Musique', 'Cinéma', 'Littérature', 'Sport', 'Divertissement',
  'Culture générale', 'Mathématiques', 'Langues', 'Cuisine'
];

const FormateurAddQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    difficulty: 'Débutant',
    category: '',
    timeLimit: 60,
    questions: []
  });

  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          questionType: 'multiple',
          timeLimit: 30,
          questionOrder: prev.questions.length,
          options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions.splice(index, 1);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quizData.questions];
    
    if (field === 'questionType' && value === 'single') {
      updated[index].options.forEach(opt => opt.isCorrect = false);
      if (updated[index].options.length > 0) {
        updated[index].options[0].isCorrect = true;
      }
    }
    
    updated[index][field] = value;
    setQuizData({ ...quizData, questions: updated });
  };

  const handleOptionChange = (qIndex, optIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    
    if (field === 'isCorrect' && value && updatedQuestions[qIndex].questionType === 'single') {
      updatedQuestions[qIndex].options.forEach((opt, idx) => {
        opt.isCorrect = idx === optIndex;
      });
    } else {
      updatedQuestions[qIndex].options[optIndex][field] = value;
    }
    
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...quizData.questions];
    const newOption = { text: '', isCorrect: false };
    
    if (updatedQuestions[qIndex].questionType === 'single' && 
        !updatedQuestions[qIndex].options.some(opt => opt.isCorrect)) {
      newOption.isCorrect = true;
    }
    
    updatedQuestions[qIndex].options.push(newOption);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...quizData.questions];
    const options = updatedQuestions[qIndex].options;
    
    if (options[optIndex].isCorrect && 
        updatedQuestions[qIndex].questionType === 'single' && 
        options.length > 1) {
      const nextOptionIndex = optIndex === 0 ? 1 : 0;
      options[nextOptionIndex].isCorrect = true;
    }
    
    options.splice(optIndex, 1);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    try {
      const token = getFormateurToken();
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const creatorId = decodedToken.id;

      const fullQuiz = { ...quizData, creator_id: creatorId };

      const response = await axios.post('http://localhost:3002/api/quizzes/full', fullQuiz, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('✅ Quiz créé avec succès');
      setQuizData({
        title: '',
        description: '',
        difficulty: 'Débutant',
        category: '',
        timeLimit: 60,
        questions: []
      });
    } catch (err) {
      alert('❌ Erreur : ' + (err.response?.data?.message || err.message));
    }
  };

  const inputStyle = {
    display: 'block',
    margin: '8px 0',
    padding: '8px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    padding: '6px 12px',
    margin: '4px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Créer un nouveau Quiz</h2>

      <input
        style={inputStyle}
        type="text"
        placeholder="Titre du quiz"
        value={quizData.title}
        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
      />
      <textarea
        style={inputStyle}
        placeholder="Description"
        value={quizData.description}
        onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
      />
      <select
        style={inputStyle}
        value={quizData.category}
        onChange={(e) => setQuizData({ ...quizData, category: e.target.value })}
      >
        <option value="">Choisir une catégorie</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <input
        style={inputStyle}
        type="number"
        placeholder="Durée (en secondes)"
        value={quizData.timeLimit}
        onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value || 0) })}
      />
      <select
        style={inputStyle}
        value={quizData.difficulty}
        onChange={(e) => setQuizData({ ...quizData, difficulty: e.target.value })}
      >
        {difficultyOptions.map((diff) => (
          <option key={diff} value={diff}>{diff}</option>
        ))}
      </select>

      <h3>Questions</h3>
      {quizData.questions.map((q, i) => (
        <div key={i} style={{ 
          marginBottom: '1rem', 
          padding: '1rem', 
          border: '1px solid #aaa', 
          borderRadius: '6px', 
          position: 'relative',
          paddingTop: '2rem' // Add space for the delete button
        }}>
          <button 
            onClick={() => removeQuestion(i)}
            style={{ 
              position: 'absolute', 
              top: '-7px', 
              right: '8px',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#dc3545'
            }}
            title="Supprimer cette question"
          >
            ×
          </button>
          
          <input
            style={inputStyle}
            type="text"
            placeholder={`Question ${i + 1}`}
            value={q.questionText}
            onChange={(e) => handleQuestionChange(i, 'questionText', e.target.value)}
          />
          <select
            style={inputStyle}
            value={q.questionType}
            onChange={(e) => handleQuestionChange(i, 'questionType', e.target.value)}
          >
            <option value="multiple">Choix multiple</option>
            <option value="single">Réponse unique</option>
          </select>

          {q.options.map((opt, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <input
                style={{ ...inputStyle, width: '70%' }}
                type="text"
                placeholder={`Option ${j + 1}`}
                value={opt.text}
                onChange={(e) => handleOptionChange(i, j, 'text', e.target.value)}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {q.questionType === 'single' ? (
                  <input
                    type="radio"
                    name={`question-${i}-correct`}
                    checked={opt.isCorrect}
                    onChange={(e) => handleOptionChange(i, j, 'isCorrect', e.target.checked)}
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) => handleOptionChange(i, j, 'isCorrect', e.target.checked)}
                  />
                )}
                {q.questionType === 'single' ? ' Correcte' : ' Correct ?'}
              </label>
              {q.options.length > 2 && (
                <button 
                  onClick={() => removeOption(i, j)}
                  style={{ 
                    ...buttonStyle,
                    backgroundColor: '#ffc107',
                    color: '#000'
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button 
            onClick={() => addOption(i)}
            style={{
              ...buttonStyle,
              backgroundColor: '#17a2b8',
              color: 'white'
            }}
          >
            + Ajouter option
          </button>
        </div>
      ))}

      <button 
        onClick={addQuestion} 
        style={{ 
          marginTop: '1rem',
          ...buttonStyle,
          backgroundColor: '#007bff',
          color: 'white',
          padding: '8px 16px'
        }}
      >
        + Ajouter une question
      </button>
      <br /><br />
      <button 
        onClick={handleSubmit} 
        style={{ 
          backgroundColor: '#28a745', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '6px', 
          border: 'none',
          cursor: 'pointer'
        }}
      >
        🚀 Créer Quiz
      </button>
    </div>
  );
};

export default FormateurAddQuiz;