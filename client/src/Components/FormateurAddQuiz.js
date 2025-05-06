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

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quizData.questions];
    updated[index][field] = value;
    setQuizData({ ...quizData, questions: updated });
  };

  const handleOptionChange = (qIndex, optIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[optIndex][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options.push({ text: '', isCorrect: false });
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
        <div key={i} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #aaa', borderRadius: '6px' }}>
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
            <option value="short">Réponse courte</option>
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
              <label>
                Correct ?
                <input
                  type="checkbox"
                  checked={opt.isCorrect}
                  onChange={(e) => handleOptionChange(i, j, 'isCorrect', e.target.checked)}
                />
              </label>
            </div>
          ))}

          <button onClick={() => addOption(i)}>+ Ajouter option</button>
        </div>
      ))}

      <button onClick={addQuestion} style={{ marginTop: '1rem' }}>+ Ajouter une question</button>
      <br /><br />
      <button onClick={handleSubmit} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none' }}>
        🚀 Créer Quiz
      </button>
    </div>
  );
};

export default FormateurAddQuiz;
