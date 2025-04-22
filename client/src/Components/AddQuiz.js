import React, { useState } from 'react';
import { createFullQuiz } from '../services/quizService';
import '../Styles/AddQuiz.css';

const AddQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    difficulty: '',
    category: '',
    questions: [
      {
        questionText: '',
        questionType: 'multiple-choice',
        timeLimit: 30,
        questionOrder: 1,
        options: [{ text: '', isCorrect: false }],
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[oIndex][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionText: '',
          questionType: 'multiple-choice',
          timeLimit: 30,
          questionOrder: quizData.questions.length + 1,
          options: [{ text: '', isCorrect: false }],
        },
      ],
    });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options.push({ text: '', isCorrect: false });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFullQuiz(quizData);
      alert('Quiz created successfully!');
      // Optionally reset form here
    } catch (error) {
      console.error(error);
      alert('Something went wrong while creating the quiz.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      <h2 className="quiz-title">Create a Quiz</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={quizData.title}
        onChange={handleChange}
        required
        className="input-field"
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={quizData.description}
        onChange={handleChange}
        className="input-field"
      />
      <input
        type="text"
        name="difficulty"
        placeholder="Difficulty"
        value={quizData.difficulty}
        onChange={handleChange}
        className="input-field"
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={quizData.category}
        onChange={handleChange}
        className="input-field"
      />

      {quizData.questions.map((question, qIndex) => (
        <div key={qIndex} className="question-container">
          <h4 className="question-title">Question {qIndex + 1}</h4>
          <input
            type="text"
            placeholder="Question Text"
            value={question.questionText}
            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Time Limit (seconds)"
            value={question.timeLimit}
            onChange={(e) => handleQuestionChange(qIndex, 'timeLimit', e.target.value)}
            className="input-field"
          />
          {question.options.map((option, oIndex) => (
            <div key={oIndex} className="option-container">
              <input
                type="text"
                placeholder={`Option ${oIndex + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                className="input-field"
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)}
                  className="checkbox-input"
                />
                Correct
              </label>
            </div>
          ))}
          <button type="button" onClick={() => addOption(qIndex)} className="add-option-button">
            Add Option
          </button>
        </div>
      ))}

      <button type="button" onClick={addQuestion} className="add-question-button">
        Add Question
      </button>
      <button type="submit" className="submit-button">
        Create Quiz
      </button>
    </form>
  );
};

export default AddQuiz;
