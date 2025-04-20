import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/AddQuiz.css';
import { createQuiz, addQuestionToQuiz } from '../services/quizService';

export default function AddQuiz({ onClose }) {
    const categories = [
        "Programming", "Web Dev", "CS", "Tools", 
        "DevOps", "Cloud", "AI", "Security"
    ];
    
    const difficulties = ["Beginner", "Intermediate", "Advanced"];
    
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        category: 'Programming',
        difficulty: 'Beginner',
        timeLimit: 30,
        questions: [
            {
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                timeLimit: 60,
                questionType: 'multiple-choice'
            }
        ]
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Handle quiz metadata changes
    const handleQuizInfoChange = (e) => {
        const { name, value } = e.target;
        setQuizData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle question text changes
    const handleQuestionChange = (index, e) => {
        const newQuestions = [...quizData.questions];
        newQuestions[index].questionText = e.target.value;
        setQuizData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };
    
    // Handle option text changes
    const handleOptionChange = (questionIndex, optionIndex, e) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].options[optionIndex] = e.target.value;
        setQuizData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };
    
    // Handle correct answer selection
    const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].correctAnswer = optionIndex;
        setQuizData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };
    
    // Handle question time limit changes
    const handleQuestionTimeChange = (questionIndex, e) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].timeLimit = parseInt(e.target.value) || 0;
        setQuizData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };
    
    // Add a new question
    const addQuestion = () => {
        setQuizData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    questionText: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    timeLimit: 60,
                    questionType: 'multiple-choice'
                }
            ]
        }));
    };
    
    // Remove a question
    const removeQuestion = (index) => {
        if (quizData.questions.length <= 1) return;
        const newQuestions = [...quizData.questions];
        newQuestions.splice(index, 1);
        setQuizData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };
    
    // Add an option to a question
    const addOption = (questionIndex) => {
        const newQuestions = [...quizData.questions];
        newQuestions[questionIndex].options.push('');
        setQuizData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };
    
    // Remove an option from a question
    const removeOption = (questionIndex, optionIndex) => {
        const newQuestions = [...quizData.questions];
        if (newQuestions[questionIndex].options.length <= 2) return;
        
        newQuestions[questionIndex].options.splice(optionIndex, 1);
        
        // Adjust correct answer if needed
        if (newQuestions[questionIndex].correctAnswer >= optionIndex) {
            newQuestions[questionIndex].correctAnswer = Math.max(0, newQuestions[questionIndex].correctAnswer - 1);
        }
        
        setQuizData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        // Validate form data
        if (!quizData.title.trim()) {
            setError('Please enter a quiz title');
            setIsSubmitting(false);
            return;
        }
        
        if (!quizData.description.trim()) {
            setError('Please enter a quiz description');
            setIsSubmitting(false);
            return;
        }
        
        // Validate all questions and options
        for (let i = 0; i < quizData.questions.length; i++) {
            const q = quizData.questions[i];
            
            if (!q.questionText.trim()) {
                setError(`Please enter text for question ${i + 1}`);
                setIsSubmitting(false);
                return;
            }
            
            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j].trim()) {
                    setError(`Please enter all options for question ${i + 1}`);
                    setIsSubmitting(false);
                    return;
                }
            }
        }
        
        try {
            // First create the quiz in the database
            const quizResponse = await createQuiz({
                title: quizData.title,
                description: quizData.description,
                difficulty: quizData.difficulty,
                category: quizData.category,
                timeLimit: quizData.timeLimit
            });
            
            const quizId = quizResponse.id;
            
            // Then add each question with its options
            for (const [index, question] of quizData.questions.entries()) {
                await addQuestionToQuiz(quizId, {
                    questionText: question.questionText,
                    questionType: question.questionType,
                    timeLimit: question.timeLimit,
                    questionOrder: index,
                    options: question.options.map((option, i) => ({
                        text: option,
                        isCorrect: i === question.correctAnswer,
                        order: i
                    }))
                });
            }
            
            // Close the modal on success
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create quiz. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="add-quiz-modal">
                <div className="modal-header">
                    <h2>Create New Quiz</h2>
                    <button 
                        onClick={onClose}
                        className="close-modal-button"
                        disabled={isSubmitting}
                    >
                        &times;
                    </button>
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="quiz-form">
                    {/* Quiz Metadata Section */}
                    <div className="quiz-meta-section">
                        <h3>Quiz Information</h3>
                        
                        <div className="form-group">
                            <label>Quiz Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={quizData.title}
                                onChange={handleQuizInfoChange}
                                placeholder="Enter quiz title"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={quizData.description}
                                onChange={handleQuizInfoChange}
                                placeholder="Enter quiz description"
                                rows="3"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Category:</label>
                                <select
                                    name="category"
                                    value={quizData.category}
                                    onChange={handleQuizInfoChange}
                                    disabled={isSubmitting}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Difficulty:</label>
                                <select
                                    name="difficulty"
                                    value={quizData.difficulty}
                                    onChange={handleQuizInfoChange}
                                    disabled={isSubmitting}
                                >
                                    {difficulties.map(difficulty => (
                                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Time Limit (minutes):</label>
                                <input
                                    type="number"
                                    name="timeLimit"
                                    min="1"
                                    max="180"
                                    value={quizData.timeLimit}
                                    onChange={handleQuizInfoChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Questions Section */}
                    <div className="questions-section">
                        <div className="section-header">
                            <h3>Questions</h3>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="add-question-btn"
                                disabled={isSubmitting}
                            >
                                + Add Question
                            </button>
                        </div>
                        
                        <div className="questions-scroll-container">
                            {quizData.questions.map((question, qIndex) => (
                                <div key={qIndex} className="question-card">
                                    <div className="question-header">
                                        <h4>Question {qIndex + 1}</h4>
                                        {quizData.questions.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeQuestion(qIndex)}
                                                className="remove-question-btn"
                                                disabled={isSubmitting}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Question Text:</label>
                                        <textarea
                                            value={question.questionText}
                                            onChange={(e) => handleQuestionChange(qIndex, e)}
                                            placeholder="Enter the question"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Time Limit (seconds):</label>
                                        <input
                                            type="number"
                                            min="10"
                                            max="300"
                                            value={question.timeLimit}
                                            onChange={(e) => handleQuestionTimeChange(qIndex, e)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    
                                    <div className="options-section">
                                        <label>Options:</label>
                                        
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className="option-row">
                                                <input
                                                    type="radio"
                                                    name={`correct-answer-${qIndex}`}
                                                    checked={question.correctAnswer === oIndex}
                                                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                                    disabled={isSubmitting}
                                                />
                                                
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                                
                                                {question.options.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(qIndex, oIndex)}
                                                        className="remove-option-btn"
                                                        disabled={isSubmitting}
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        
                                        <button
                                            type="button"
                                            onClick={() => addOption(qIndex)}
                                            className="add-option-btn"
                                            disabled={isSubmitting || question.options.length >= 6}
                                        >
                                            + Add Option
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Form Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-button"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}