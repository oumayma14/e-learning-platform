import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Modal, Badge, Pagination, Spinner, Alert } from 'react-bootstrap';
import "../Styles/MainQuiz.css";
import { challengeService } from '../services/challengeService';
import { useAuth } from '../context/AuthContext';
import ChallengeModal from './ChallengeModal';
import { generateChallengeCode } from '../utils/generatedCode';
import { getQuizzes } from '../services/quizService';

export default function MainQuiz() {
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const { user } = useAuth();
    const [challengeCode, setChallengeCode] = useState(null);
    const navigate = useNavigate();
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const quizzesPerPage = 6;

    const allCategories = [
        'Géographie', 'Histoire', 'Science', 'Technologie', 'Art',
        'Musique', 'Cinéma', 'Littérature', 'Sport', 'Divertissement',
        'Culture générale', 'Mathématiques', 'Langues', 'Cuisine'
    ];

    const handleJoinChallenge = () => {
        if (joinCode) {
            navigate(`/dashboard/catalogue/quiz-start/join-challenge/${encodeURIComponent(joinCode)}`);
        }
    };

    const handleCreateChallenge = async (quizId) => {
        try {
            const generatedCode = generateChallengeCode();
            const res = await challengeService.createChallenge(quizId, user.username, generatedCode);
            setChallengeCode(generatedCode);
            setShowChallengeModal(true);
        } catch (error) {
            console.error("Erreur création défi: ", error.message);
        }
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const response = await getQuizzes();
                if (response.success && response.data) {
                    const quizzes = response.data.map(quiz => ({
                        id: quiz.id,
                        title: quiz.title,
                        description: quiz.description,
                        difficulty: quiz.difficulty,
                        category: quiz.category,
                        timeLimit: quiz.time_limit
                    }));
                    setAllQuizzes(quizzes);
                } else {
                    setError(response.message || 'Erreur serveur lors du chargement des quizzes');
                }
            } catch (err) {
                setError('Impossible de charger les quizzes. Réessaye plus tard.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const allDifficulties = [...new Set(allQuizzes.map(quiz => quiz.difficulty).filter(d => d))];

    const filteredQuizzes = allQuizzes.filter(quiz => {
        return (
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategories.length === 0 || selectedCategories.includes(quiz.category)) &&
            (selectedDifficulties.length === 0 || selectedDifficulties.includes(quiz.difficulty))
        );
    });

    const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
    const indexOfLastQuiz = currentPage * quizzesPerPage;
    const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
    const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const toggleDifficulty = (difficulty) => {
        setSelectedDifficulties(prev =>
            prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
        );
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        setSelectedDifficulties([]);
        setCurrentPage(1);
    };

    const applyFilters = () => {
        setCurrentPage(1);
        setShowFilters(false);
    };

    const activeFilterCount = [
        selectedCategories.length,
        selectedDifficulties.length
    ].filter(Boolean).length;

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff'
            }}>
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: '20px'
            }}>
                <Alert variant="danger" style={{ maxWidth: '500px' }}>
                    <Alert.Heading>Erreur de chargement</Alert.Heading>
                    <p>{error}</p>
                    <Button variant="outline-danger" onClick={() => window.location.reload()}>
                        Réessayer
                    </Button>
                </Alert>
            </div>
        );
    }

    return (
        <div style={{
            top: 100,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '15px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000
            }}>
                <Row className="align-items-center">
                    <Col md={6} className="mb-3 mb-md-0">
                        <Form.Control
                            type="text"
                            placeholder="Rechercher un quiz par nom..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{ 
                                borderColor: '#515151',
                                borderRadius: '20px',
                                width: '100%'
                            }}
                        />
                    </Col>
                    <Col md={6} className="d-flex justify-content-end">
                        <div style={{ display: 'flex', gap: '10px' , paddingRight:'10px'}}>
                            <Button
                                onClick={() => setShowFilters(true)}
                                variant={activeFilterCount > 0 ? 'danger' : 'outline-danger'}
                                style={{ borderRadius: '20px' }} className='button'
                            >
                                Filtres {activeFilterCount > 0 && `(${activeFilterCount})`}
                            </Button>
                            <Button
                                onClick={() => navigate('add-quiz')}
                                variant="danger"
                                style={{ borderRadius: '20px' }} className='button'
                            >
                                + Ajouter un Quiz
                            </Button>
                            <Button
                                onClick={() => setShowJoinModal(true)}
                                variant="outline-danger"
                                style={{ borderRadius: '20px' }} className='button'
                            >
                                🎯 Rejoindre un défi
                            </Button>
                        </div>
                    </Col>
                    {(searchTerm || activeFilterCount > 0) && (
                        <Col xs={12} className="mt-2">
                            <Button onClick={resetFilters} variant="link" className="text-danger p-0">
                                Réinitialiser tout
                            </Button>
                        </Col>
                    )}
                </Row>
            </div>

            {/* Content Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                width: '100%'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <p className="text-muted">
                        Affichage de {filteredQuizzes.length} sur {allQuizzes.length} quiz
                    </p>
                </div>

                {filteredQuizzes.length === 0 ? (
                    <Alert variant="info" className="text-center">
                        Aucun quiz ne correspond à vos critères. Essayez de modifier vos filtres.
                    </Alert>
                ) : (
                    <>
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', // minmax(0, 1fr) prevents overflow
                            gap: '20px',
                            marginBottom: '20px'
                        }}>
                            {currentQuizzes.map(quiz => (
                                <Card key={quiz.id} style={{ 
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '15px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}>
                                    <Card.Header style={{ 
                                        backgroundColor: '#be4d4d',
                                        color: 'white',
                                        borderTopLeftRadius: '15px',
                                        borderTopRightRadius: '15px'
                                    }}>
                                        {quiz.category}
                                    </Card.Header>
                                    <Card.Body style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <Card.Title style={{ color: '#515151' }}>{quiz.title}</Card.Title>
                                        <Card.Text style={{ flex: 1, color: '#6c757d' }}>
                                            {quiz.description}
                                        </Card.Text>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                            <Badge bg={
                                                quiz.difficulty.toLowerCase() === 'facile' ? 'success' : 
                                                quiz.difficulty.toLowerCase() === 'moyen' ? 'warning' : 'danger'
                                            }>
                                                {quiz.difficulty}
                                            </Badge>
                                            <span className="text-muted timer">
                                                ⏱ {Math.ceil(quiz.timeLimit / 60)} min
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <Button
                                                as={Link}
                                                to={`quiz/${quiz.id}`}
                                                variant="danger"
                                                style={{ borderRadius: '10px' }}
                                            >
                                                Commencer le Quiz
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                style={{ borderRadius: '10px' }}
                                                onClick={() => handleCreateChallenge(quiz.id)}
                                            >
                                                ⚔️ Défier un ami
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                               <Pagination className="custom-pagination">
      <Pagination.Prev
        onClick={() => {
          setCurrentPage(prev => prev - 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === 1}
      />
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => {
            setCurrentPage(number);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => {
          setCurrentPage(prev => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === totalPages}
      />
    </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <Modal show={showFilters} onHide={() => setShowFilters(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#fe6363', color: '#ffffff' }}>
                    <Modal.Title>Filtres</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ marginBottom: '15px' }}>Catégories</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {allCategories.map(category => (
                                <Button
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    variant={selectedCategories.includes(category) ? 'danger' : 'outline-danger'}
                                    size="sm"
                                    style={{ borderRadius: '15px' }}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h5 style={{ marginBottom: '15px' }}>Difficulté</h5>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {allDifficulties.map(difficulty => (
                                <Button
                                    key={difficulty}
                                    onClick={() => toggleDifficulty(difficulty)}
                                    variant={selectedDifficulties.includes(difficulty) ? 'danger' : 'outline-danger'}
                                    size="sm"
                                    style={{ borderRadius: '15px' }}
                                >
                                    {difficulty}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={resetFilters}>
                        Réinitialiser tout
                    </Button>
                    <Button variant="danger" onClick={applyFilters}>
                        Appliquer les filtres
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)} centered>
                <Modal.Header closeButton style={{ backgroundColor: '#fe6363', color: '#ffffff' }}>
                    <Modal.Title>🎯 Rejoindre un défi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Colle ici le code du défi"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        style={{ borderRadius: '10px', marginBottom: '15px' }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => setShowJoinModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={handleJoinChallenge}>
                        Rejoindre
                    </Button>
                </Modal.Footer>
            </Modal>

            <ChallengeModal
                show={showChallengeModal}
                onClose={() => setShowChallengeModal(false)}
                challengeCode={challengeCode}
            />
        </div>
    );
}