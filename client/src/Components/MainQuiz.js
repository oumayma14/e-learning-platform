import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    const{user} = useAuth();
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

    const handleJoinChallenge = () =>{
        if(joinCode){
            navigate(`/dashboard/catalogue/quiz-start/join-challenge/${encodeURIComponent(joinCode)}`);

        }
    }

    const handleCreateChallenge = async (quizId) =>{
        try{
            const generatedCode = generateChallengeCode();
            const res = await challengeService.createChallenge(quizId, user.username, generatedCode);
            setChallengeCode(generatedCode);
            setShowChallengeModal(true); 
        }catch(error){
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
                  console.error('Erreur serveur:', response.message);
                  setError(response.message || 'Erreur serveur lors du chargement des quizzes');
                }
                
              } catch (err) {
                console.error('Erreur réseau lors du chargement des quizzes:', err.message);
                setError('Impossible de charger les quizzes. Réessaye plus tard.');
                
              } finally {
                setLoading(false);
              }
            };
          
            fetchQuizzes();
          }, []);

    const formatTime = (seconds) => {
        if (!seconds) return 'No time limit';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
    };

    const allCategories = [
        'Géographie', 'Histoire', 'Science', 'Technologie', 'Art', 
        'Musique', 'Cinéma', 'Littérature', 'Sport', 'Divertissement',
        'Culture générale', 'Mathématiques', 'Langues', 'Cuisine'
    ];

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

    const groupedQuizzes = [];
    for (let i = 0; i < currentQuizzes.length; i += 3) {
        groupedQuizzes.push(currentQuizzes.slice(i, i + 3));
    }

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
            <div className="quiz-app-container">
                <div className="quiz-container">
                    <div className="loading-message">Chargement des quizzes...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-app-container">
                <div className="quiz-container">
                    <div className="error-message">
                        <h3>Erreur de chargement</h3>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>Réessayer</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-app-container">
            <div className="quiz-container">
                <div className="quiz-content-wrapper">
                    <div className="controls-container">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Rechercher un quiz par nom..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="search-input"
                            />
                            {(searchTerm || activeFilterCount > 0) && (
                                <button onClick={resetFilters} className="clear-search-button">
                                    Réinitialiser tout
                                </button>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button 
                                onClick={() => setShowFilters(true)}
                                className={`filter-toggle-button ${activeFilterCount > 0 ? 'active' : ''}`}
                            >
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="filter-count">{activeFilterCount}</span>
                                )}
                            </button>

                            <button 
                                onClick={() => navigate('add-quiz')}
                                className="add-quiz-button"
                            >
                                + Ajouter un Quiz
                            </button>
                            <button 
                            onClick={() => setShowJoinModal(true)} 
                            className="join-challenge-button"
                            >
                            🎯 Rejoindre un défi
                            </button>

                        </div>
                    </div>

                    {/* Filter Modal */}
                    {showFilters && (
                        <div className="modal-overlay" onClick={() => setShowFilters(false)}>
                            <div className="filter-modal" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2 className='filter-title'>Filtres</h2>
                                    <button 
                                        className="close-modal-button"
                                        onClick={() => setShowFilters(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div className="filters-section">
                                    <div className="filter-group">
                                        <h3 className="filter-title">Catégories</h3>
                                        <div className="filter-options">
                                            {allCategories.map(category => (
                                                <button
                                                    key={category}
                                                    onClick={() => toggleCategory(category)}
                                                    className={`filter-option ${selectedCategories.includes(category) ? 'active' : ''}`}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="filter-group">
                                        <h3 className="filter-title">Difficulté</h3>
                                        <div className="filter-options">
                                            {allDifficulties.map(difficulty => (
                                                <button
                                                    key={difficulty}
                                                    onClick={() => toggleDifficulty(difficulty)}
                                                    className={`filter-option ${selectedDifficulties.includes(difficulty) ? 'active' : ''}`}
                                                >
                                                    {difficulty}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button 
                                        onClick={resetFilters}
                                        className="clear-filters-button"
                                    >
                                        Réinitialiser tout
                                    </button>
                                    <button 
                                        onClick={applyFilters}
                                        className="apply-filters-button"
                                    >
                                        Appliquer les filtres
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="results-info">
                        <span className="results-count">
                        Affichage de {filteredQuizzes.length} sur {allQuizzes.length} quiz
                        </span>
                    </div>

                    {filteredQuizzes.length === 0 ? (
                        <div className="no-results-message">
                            Aucun quiz ne correspond à vos critères. Essayez de modifier vos filtres.
                        </div>
                    ) : (
                        <>
                            <div className="quiz-rows-container">
                            {showJoinModal && (
                            <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>🎯 Rejoindre un défi</h2>
                                <input 
                                    type="text" 
                                    placeholder="Colle ici le code du défi" 
                                    value={joinCode} 
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    className="modal-input" style={{backgroundColor: 'white'}}
                                />
                                <button 
                                    onClick={handleJoinChallenge} 
                                    className="modal-button"
                                >
                                    Rejoindre
                                </button>
                                <button 
                                    onClick={() => setShowJoinModal(false)} 
                                    className="modal-cancel-button"
                                >
                                    Annuler
                                </button>
                                </div>
                            </div>
                            )}
                                {groupedQuizzes.map((row, rowIndex) => (
                                    <div key={rowIndex} className="quiz-row">
                                        {row.map(quiz => (
                                            <div key={quiz.id} className="quiz-card">
                                                <div className={`quiz-card__badge ${quiz.category.replace(/\s+/g, '-').toLowerCase()}`}>
                                                    {quiz.category}
                                                </div>
                                                <div className="quiz-card__content">
                                                    <h3 className="quiz-card__title">{quiz.title}</h3>
                                                    <p className="quiz-card__description">{quiz.description}</p>
                                                    <div className="quiz-card__meta">
                                                        <span className={`difficulty difficulty-${quiz.difficulty.toLowerCase()}`}>
                                                            {quiz.difficulty}
                                                        </span>
                                                        <span className="quiz-time">
                                                            ⏱ {Math.ceil(quiz.timeLimit / 60)} min
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="quiz-card__actions">
                                                    <Link to={`quiz/${quiz.id}`} className="quiz-card__button">
                                                        Commencer le Quiz
                                                    </Link>
                                                    <button className="quiz-challenge-btn" onClick={() => handleCreateChallenge(quiz.id)}>
                                                        ⚔️ Défier un ami
                                                    </button>
                                                    </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button 
                                        onClick={() => {
                                            setCurrentPage(prev => prev - 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === 1}
                                        className="pagination-button"
                                    >
                                        Précédent
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => {
                                                setCurrentPage(number);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    
                                    <button 
                                        onClick={() => {
                                            setCurrentPage(prev => prev + 1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        disabled={currentPage === totalPages}
                                        className="pagination-button"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <ChallengeModal 
            show={showChallengeModal} 
            onClose={() => setShowChallengeModal(false)} 
            challengeCode={challengeCode}
            />
        </div>
    );
}
