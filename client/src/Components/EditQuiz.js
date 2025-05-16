import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Modal, Table } from 'react-bootstrap';

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

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        console.log("Fetching quiz data...");
        const token = localStorage.getItem('formateurToken');
        const response = await axios.get(`http://localhost:3002/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("API Response:", response.data);

        const quiz = response.data.data || {};

        // Ensure questions and options are correctly structured
        if (!quiz.questions) {
          console.warn("No questions found in the quiz data.");
          quiz.questions = [];
        } else {
          console.log("Questions found:", quiz.questions);
          quiz.questions = quiz.questions.map(question => ({
            ...question,
            options: question.options || []
          }));
        }

        setQuizData(quiz);
        setLoading(false);
        console.log("Quiz data successfully loaded:", quiz);

      } catch (error) {
        console.error("Error loading quiz data:", error);
        alert("Erreur lors du chargement du quiz.");
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleQuizInfoChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating quiz info: ${name} = ${value}`);
    setQuizData({ ...quizData, [name]: value });
  };

  const handleTimeLimitChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    console.log(`Updating time limit: ${value}`);
    setQuizData(prev => ({ ...prev, timeLimit: value }));
  };

  const handleQuestionChange = (qIndex, field, value) => {
    console.log(`Updating question ${qIndex + 1} - ${field}: ${value}`);
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    console.log(`Updating option ${oIndex + 1} of question ${qIndex + 1} - ${field}: ${value}`);
    const updatedQuestions = [...quizData.questions];
    const options = updatedQuestions[qIndex].options;
    options[oIndex][field] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    console.log("Adding a new question...");
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        {
          questionText: '',
          questionType: 'unique',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false }
          ],
          correctShortAnswer: ''
        }
      ]
    });
  };

  const deleteQuestion = (qIndex) => {
    console.log(`Deleting question ${qIndex + 1}...`);
    const updatedQuestions = quizData.questions.filter((_, index) => index !== qIndex);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addOption = (qIndex) => {
    console.log(`Adding option to question ${qIndex + 1}...`);
    const updatedQuestions = [...quizData.questions];
    const question = updatedQuestions[qIndex];

    if (question.options.length >= 5) {
      alert("Maximum 5 options par question");
      return;
    }

    question.options.push({ text: '', isCorrect: false });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const deleteOption = (qIndex, oIndex) => {
    console.log(`Deleting option ${oIndex + 1} from question ${qIndex + 1}...`);
    const updatedQuestions = [...quizData.questions];
    const options = updatedQuestions[qIndex].options;

    if (options.length <= 2) {
      alert("Chaque question doit avoir au moins deux options");
      return;
    }

    options.splice(oIndex, 1);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSave = async () => {
    try {
      console.log("Saving quiz data:", quizData);
      const token = localStorage.getItem('formateurToken');
      await axios.put(`http://localhost:3002/api/quizzes/${quizId}`, quizData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Quiz mis à jour avec succès.");
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

      {/* Quiz Info */}
      <Form.Group>
        <Form.Label>Titre</Form.Label>
        <Form.Control type="text" name="title" value={quizData.title} onChange={handleQuizInfoChange} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" name="description" value={quizData.description} onChange={handleQuizInfoChange} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Difficulté</Form.Label>
        <Form.Control as="select" name="difficulty" value={quizData.difficulty} onChange={handleQuizInfoChange}>
          <option value="">Sélectionner une difficulté</option>
          {['Débutant', 'Intermédiaire', 'Avancé'].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Catégorie</Form.Label>
        <Form.Control as="select" name="category" value={quizData.category} onChange={handleQuizInfoChange}>
          <option value="">Sélectionner une catégorie</option>
          {[
            'Géographie', 'Histoire', 'Science', 'Technologie', 'Art', 
            'Musique', 'Cinéma', 'Littérature', 'Sport', 'Divertissement',
            'Culture générale', 'Mathématiques', 'Langues', 'Cuisine'
          ].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Limite de temps (en secondes)</Form.Label>
        <Form.Control type="number" value={quizData.timeLimit} onChange={handleTimeLimitChange} />
      </Form.Group>


      {/* Questions Table */}
      <h3>Questions et Réponses</h3>
      <Table striped bordered hover responsive>
  <thead>
    <tr>
      <th>Question</th>
      <th>Réponses</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
  {quizData.questions.map((question, qIndex) => (
    <tr key={qIndex}>
        <td>
            <Form.Control
                type="text"
                value={question.question_text || ''}
                onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
            />
        </td>
        <td>
        {question.options && question.options.length > 0 ? (
        question.options.map((option, oIndex) => (
            <div key={oIndex} className="option-row">
                <Form.Check
                    type={question.question_type === 'multiple' ? 'checkbox' : 'radio'}
                    checked={option.is_correct === 1}
                    onChange={() => handleOptionChange(qIndex, oIndex, 'is_correct', option.is_correct === 1 ? 0 : 1)}
                />
                <Form.Control
                    type="text"
                    value={option.option_text || ''}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'option_text', e.target.value)}
                />
                <Button variant="danger" onClick={() => deleteOption(qIndex, oIndex)} style={{ marginLeft: '5px' }}>
                    ×
                </Button>
            </div>
        ))
    ) : (
        <p>Aucune option trouvée</p>
    )}

            <Button variant="secondary" onClick={() => addOption(qIndex)} style={{ marginTop: '5px' }}>
                + Ajouter Option
            </Button>
        </td>
        <td>
            <Button variant="danger" onClick={() => deleteQuestion(qIndex)}>Supprimer</Button>
        </td>
    </tr>
))}

  </tbody>
</Table>


      <Button variant="success" onClick={addQuestion} style={{ marginTop: '20px' }}>+ Ajouter Question</Button>
      <Button variant="primary" onClick={handleSave} style={{ marginTop: '20px', marginLeft: '10px' }}>Enregistrer</Button>
    </Container>
  );
};

export default EditQuiz;
