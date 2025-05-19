import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Pagination, Container, Collapse, Form, Row, Col, Modal } from 'react-bootstrap';
import '../Styles/AddQuizManagement.css';
import { createFullQuiz } from '../services/quizService';


const AdminQuizManagement = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQuiz, setExpandedQuiz] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);
    const minHeight = "100vh";
    const pageSize = 12;

    useEffect(() => {
        fetchCategories();
        fetchQuizzes(currentPage);
    }, [currentPage, searchTerm, categoryFilter, difficultyFilter]);

    // Fetch categories dynamically from the server
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/admin/categories', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            setCategories(response.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err.message);
            setError(err.message || 'Error fetching categories');
        }
    };

    // Fetch quizzes with search, filters, and pagination
    const fetchQuizzes = async (page) => {
        try {
            const response = await axios.get('http://localhost:3002/api/admin/quizzes', {
                params: {
                    page,
                    pageSize,
                    search: searchTerm,
                    category: categoryFilter,
                    difficulty: difficultyFilter
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            setQuizzes(response.data.quizzes || []);
            setTotalPages(response.data.totalPages || 1);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Error fetching quizzes');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleCategoryFilter = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleDifficultyFilter = (e) => {
        setDifficultyFilter(e.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const confirmDelete = (quizId) => {
        setQuizToDelete(quizId);
        setShowConfirmModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3002/api/admin/quizzes/${quizToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            setShowConfirmModal(false);
            setQuizToDelete(null);
            fetchQuizzes(currentPage); // Refresh current page
        } catch (err) {
            setError(err.message || 'Error deleting quiz');
        }
    };

    const toggleQuizDetails = (quizId) => {
        setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <div className="loading">Chargement des quiz...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <Container className="mt-5" style={{ minHeight }}>
            <h2>Gestion des quiz</h2>

            {/* Search and Filter Controls */}
            <Form className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Recherche par titre..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Select value={categoryFilter} onChange={handleCategoryFilter}>
                            <option value="">Filter by Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={4}>
                        <Form.Select value={difficultyFilter} onChange={handleDifficultyFilter}>
                            <option value="">Filtrer par difficulté</option>
                            <option value="Débutant">Débutant</option>
                            <option value="Intermédiaire">Intermédiaire</option>
                            <option value="Avancé">Avancé</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Form>
            <Button 
        style={{ marginBottom: '1.5rem', backgroundColor: '#be4d4d', borderColor: '#be4d4d', padding: '0.6rem 1.2rem' }}
      >
        + Créer un Quiz
      </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Titre</th>
                        <th>Catégorie</th>
                        <th>Difficulté</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz, index) => (
                        <React.Fragment key={quiz.id}>
                            <tr>
                                <td>{index + 1 + (currentPage - 1) * pageSize}</td>
                                <td>{quiz.title}</td>
                                <td>{quiz.category}</td>
                                <td>{quiz.difficulty}</td>
                                <td>
                                    <Button variant="primary" size="sm" onClick={() => toggleQuizDetails(quiz.id)}>
                                        {expandedQuiz === quiz.id ? 'Cacher les détails' : 'Voir les détails'}
                                    </Button>{' '}
                                    <Button variant="danger" size="sm" onClick={() => confirmDelete(quiz.id)}>
                                        Supprimer
                                    </Button>
                                </td>
                            </tr>
                            <tr key={`details-${quiz.id}`}>
                                <td colSpan="5">
                                    <Collapse in={expandedQuiz === quiz.id}>
                                        <div className="quiz-details">
                                            <h5>Questions:</h5>
                                            {(quiz.questions || []).map((question, qIndex) => (
                                                <div key={`${quiz.id}-${question.id}`} className="mb-3">
                                                    <strong>Q{qIndex + 1}: {question.text}</strong>
                                                    <ul>
                                                        {(question.options || []).map(option => (
                                                            <li key={`${quiz.id}-${question.id}-${option.id}`}>
                                                                {option.text} {option.isCorrect && <span className="badge bg-success">Correcte</span>}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </Collapse>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item 
                        key={`page-${i + 1}`} 
                        active={i + 1 === currentPage} 
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>Êtes-vous sûr de vouloir supprimer ce quiz ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminQuizManagement;
