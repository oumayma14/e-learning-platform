import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import '../Styles/formateurdashboard.css';

const FormateurDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const token = localStorage.getItem('formateurToken');
        const response = await axios.get('http://localhost:3002/api/quizzes/formateur/quizzes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizzes(response.data.data || []);
      } catch (error) {
        console.error('Erreur récupération quizzes :', error);
        alert('Erreur lors du chargement des quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  const handleEditQuiz = (quizId) => {
    navigate(`/formateur/dashboard/edit-quiz/${quizId}`);
  };

  const handleViewLeaderboard = (quizId) => {
    navigate(`/formateur/dashboard/leaderboard/${quizId}`);
  };

  const handleDeleteQuiz = async () => {
    try {
      const token = localStorage.getItem('formateurToken');
      await axios.delete(`http://localhost:3002/api/quizzes/${quizToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete));
      setShowDeleteModal(false);
      alert("Quiz supprimé avec succès.");
    } catch (error) {
      console.error("Erreur suppression quiz :", error);
      alert("Erreur lors de la suppression du quiz.");
    }
  };

  const confirmDelete = (quizId) => {
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setQuizToDelete(null);
    setShowDeleteModal(false);
  };

  // Pagination logic
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dashboard-container" style={{ padding: '2rem', color: '#515151' }}>
      <h1 style={{ color: '#be4d4d', textAlign: 'center' }}>Bienvenue Formateur !</h1>

      <Button
        onClick={() => navigate('/formateur/dashboard/add-quiz')}
        style={{ marginBottom: '1.5rem', backgroundColor: '#be4d4d', borderColor: '#be4d4d', padding: '0.6rem 1.2rem' }}
      >
        + Créer un Quiz
      </Button>

      <h2 style={{ marginBottom: '1rem' }}>Vos Quizzes</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : currentQuizzes.length === 0 ? (
        <p>Vous n'avez encore créé aucun quiz.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Difficulté</th>
                <th>Durée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentQuizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>{quiz.title}</td>
                  <td>{quiz.category}</td>
                  <td>{quiz.difficulty}</td>
                  <td>{Math.floor(quiz.time_limit / 60)} min</td>
                  <td>
                    <Button variant="info" onClick={() => handleViewLeaderboard(quiz.id)} style={{ marginRight: '0.5rem' }}>
                      Voir le leaderboard
                    </Button>
                    <Button variant="warning" onClick={() => handleEditQuiz(quiz.id)} style={{ marginRight: '0.5rem' }}>
                      Modifier
                    </Button>
                    <Button variant="danger" onClick={() => confirmDelete(quiz.id)}>
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de Suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteQuiz}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FormateurDashboard;
