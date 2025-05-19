import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Table } from 'react-bootstrap';

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    difficulty: '',
    category: '',
    timeLimit: 30,
    questions: [],
  });
  const [loading, setLoading] = useState(true);

  // ✅ Load quiz data on mount
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const token = localStorage.getItem('formateurToken');
        const response = await axios.get(`http://localhost:3002/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const quiz = response.data.data || {};

        // Ensure questions and options are correctly structured
        if (quiz.questions) {
          quiz.questions = quiz.questions.map(question => ({
            ...question,
            options: question.options || []
          }));
        } else {
          quiz.questions = [];
        }

        setQuizData(quiz);
        setLoading(false);

      } catch (error) {
        console.error("Error loading quiz data:", error);
        alert("Erreur lors du chargement du quiz.");
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // ✅ Handle changes to quiz info (title, description, difficulty, category)
  const handleQuizInfoChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  // ✅ Handle changes to the time limit
  const handleTimeLimitChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuizData(prev => ({ ...prev, timeLimit: value }));
  };

  // ✅ Handle changes to individual questions
  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // ✅ Handle changes to individual options
  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...quizData.questions];
    const options = updatedQuestions[qIndex].options;
    options[oIndex][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // ✅ Add a new question
  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          question_text: '',
          question_type: 'unique',
          correct_short_answer: '',
          question_order: quizData.questions.length + 1,
          options: [
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false }
          ]
        }
      ]
    });
  };

  // ✅ Delete a question
  const deleteQuestion = (qIndex) => {
    const updatedQuestions = [...quizData.questions];
    const questionToDelete = updatedQuestions[qIndex];

    if (questionToDelete.id) {
      try {
        const token = localStorage.getItem('formateurToken');
        axios.delete(`http://localhost:3002/api/quizzes/questions/${questionToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
          // ✅ Remove the question from the local state
          updatedQuestions.splice(qIndex, 1);
          setQuizData({ ...quizData, questions: updatedQuestions });
        });
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Erreur lors de la suppression de la question.");
        return;
      }
    } else {
      // ✅ Just remove the question from the state if it doesn't have an ID
      updatedQuestions.splice(qIndex, 1);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  // ✅ Add an option to a question
  const addOption = (qIndex) => {
    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[qIndex];

    if (question.options.length >= 5) {
      alert("Maximum 5 options par question");
      return;
    }

    question.options.push({ option_text: '', is_correct: false });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // ✅ Delete an option from a question
  const deleteOption = (qIndex, oIndex) => {
    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[qIndex];
    const optionToDelete = question.options[oIndex];

    if (question.options.length <= 2) {
      alert("Chaque question doit avoir au moins deux options");
      return;
    }

    if (optionToDelete.id) {
      try {
        const token = localStorage.getItem('formateurToken');
        axios.delete(`http://localhost:3002/api/quizzes/option/${optionToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(() => {
          // ✅ Remove the option from the local state
          question.options.splice(oIndex, 1);
          setQuizData({ ...quizData, questions: updatedQuestions });
        });
      } catch (error) {
        console.error("Error deleting option:", error);
        alert("Erreur lors de la suppression de l'option.");
        return;
      }
    } else {
      // ✅ Just remove the option from the state if it doesn't have an ID
      question.options.splice(oIndex, 1);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  // ✅ Save the updated quiz and questions
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('formateurToken');

      // ✅ Update the main quiz info
      const quizInfo = {
        title: quizData.title,
        description: quizData.description,
        difficulty: quizData.difficulty,
        category: quizData.category,
        timeLimit: quizData.timeLimit,
      };

      await axios.put(`http://localhost:3002/api/quizzes/${quizId}`, quizInfo, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Update the questions and options
      const questionsPayload = {
        questions: quizData.questions.map(question => ({
          id: question.id,
          question_text: question.question_text,
          question_type: question.question_type,
          question_order: question.question_order || 0,
          correct_short_answer: question.correct_short_answer || '',
          time_limit: question.time_limit || 60,
          options: question.options.map(option => ({
            id: option.id,
            option_text: option.option_text,
            is_correct: option.is_correct,
            option_order: option.option_order || 0
          }))
        }))
      };

      await axios.put(`http://localhost:3002/api/quizzes/${quizId}/questions`, questionsPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Quiz et questions mis à jour avec succès.");
      navigate('/formateur/dashboard');
    } catch (error) {
      console.error("Error saving quiz data:", error);
      alert("Erreur lors de la mise à jour du quiz.");
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <Container>
      <h2>Modifier le Quiz</h2>

      {/* Questions Table */}
      <Table striped bordered hover responsive>
        <tbody>
          {quizData.questions.map((question, qIndex) => (
            <tr key={qIndex}>
              <td>
                <Form.Control
                  type="text"
                  value={question.question_text || ''}
                  onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                />
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} style={{ marginLeft: '15px', display: 'flex', alignItems: 'center' }}>
                    <Form.Control
                      type="text"
                      value={option.option_text || ''}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, 'option_text', e.target.value)}
                    />
                    <Form.Check
                      type="checkbox"
                      checked={option.is_correct || false}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, 'is_correct', e.target.checked)}
                    />
                    <Button variant="danger" size="sm" onClick={() => deleteOption(qIndex, oIndex)} style={{ marginLeft: '10px' }}>
                      ×
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={() => addOption(qIndex)}>+ Ajouter Option</Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => deleteQuestion(qIndex)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="success" onClick={addQuestion}>+ Ajouter Question</Button>
      <Button variant="primary" onClick={handleSave} style={{ marginLeft: '10px' }}>Enregistrer</Button>
    </Container>
  );
};

export default EditQuiz;
