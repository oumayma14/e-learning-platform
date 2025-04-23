import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../Styles/MainQuiz.css";
import { QUIZ_API_URL } from '../services/quizService';

export default function MainQuiz() {
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

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const response = await fetch(QUIZ_API_URL);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success && result.data) {
                    const quizzes = result.data.map(quiz => ({
                        id: quiz.id,
                        title: quiz.title,
                        description: quiz.description,
                        difficulty: quiz.difficulty,
                        category: quiz.category
                    }));

                    setAllQuizzes(quizzes);
                } else {
                    throw new Error(result.message || 'Failed to load quizzes');
                }
            } catch (err) {
                console.error('Error loading quizzes:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

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
                    <div className="loading-message">Loading quizzes...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-app-container">
                <div className="quiz-container">
                    <div className="error-message">
                        <h3>Loading Error</h3>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>Try Again</button>
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
                                placeholder="Search for a quiz by name..."
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
                                + Add Quiz
                            </button>
                        </div>
                    </div>

                    {/* Filter Modal */}
                    {showFilters && (
                        <div className="modal-overlay" onClick={() => setShowFilters(false)}>
                            <div className="filter-modal" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Filters</h2>
                                    <button 
                                        className="close-modal-button"
                                        onClick={() => setShowFilters(false)}
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div className="filters-section">
                                    <div className="filter-group">
                                        <h3 className="filter-title">Categories</h3>
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
                                        <h3 className="filter-title">Difficulty</h3>
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
                                        Reset
                                    </button>
                                    <button 
                                        onClick={applyFilters}
                                        className="apply-filters-button"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="results-info">
                        <span className="results-count">
                            Showing {filteredQuizzes.length} of {allQuizzes.length} quizzes
                        </span>
                    </div>

                    {filteredQuizzes.length === 0 ? (
                        <div className="no-results-message">
                            No quizzes match your criteria. Try adjusting your filters.
                        </div>
                    ) : (
                        <>
                            <div className="quiz-rows-container">
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
                                                    </div>
                                                </div>
                                                <Link to={`quiz/${quiz.id}`} className="quiz-card__button">
                                                    Start Quiz
                                                </Link>
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
                                        Previous
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
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
