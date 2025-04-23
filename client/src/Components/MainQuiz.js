import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../Styles/MainQuiz.css";
import { QUIZ_API_URL } from '../services/quizService';

export default function MainQuiz({ onAddQuizClick }) {
    // Move quiz data to state
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [questionRange, setQuestionRange] = useState([0, 100]); // Default range until we get real data
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const quizzesPerPage = 6;

    // Fetch quizzes from API when component mounts
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
                    // Map the backend data to match our frontend structure
                    const quizzes = result.data.map(quiz => ({
                        id: quiz.id,
                        title: quiz.title,
                        description: quiz.description,
                        questionsCount: quiz.questions ? quiz.questions.length : 0, // If questions are included
                        difficulty: quiz.difficulty,
                        category: quiz.category
                    }));
                    
                    setAllQuizzes(quizzes);
                    
                    // Set question range based on actual data
                    const maxQuestions = Math.max(...quizzes.map(quiz => quiz.questionsCount), 0);
                    setQuestionRange([0, maxQuestions]);
                } else {
                    throw new Error(result.message || 'Failed to fetch quizzes');
                }
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Get all unique categories and difficulties
    const allCategories = [...new Set(allQuizzes.map(quiz => quiz.category))];
    const allDifficulties = [...new Set(allQuizzes.map(quiz => quiz.difficulty))];
    const maxQuestions = Math.max(...allQuizzes.map(quiz => quiz.questionsCount), 0);

    // Filter quizzes
    const filteredQuizzes = allQuizzes.filter(quiz => {
        return (
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategories.length === 0 || selectedCategories.includes(quiz.category)) &&
            (selectedDifficulties.length === 0 || selectedDifficulties.includes(quiz.difficulty)) &&
            quiz.questionsCount >= questionRange[0] && 
            quiz.questionsCount <= questionRange[1]
        );
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
    const indexOfLastQuiz = currentPage * quizzesPerPage;
    const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
    const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

    // Group quizzes into rows of 3
    const groupedQuizzes = [];
    for (let i = 0; i < currentQuizzes.length; i += 3) {
        groupedQuizzes.push(currentQuizzes.slice(i, i + 3));
    }

    // Helper functions
    const toggleCategory = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
        setCurrentPage(1);
    };

    const toggleDifficulty = (difficulty) => {
        setSelectedDifficulties(prev => 
            prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
        );
        setCurrentPage(1);
    };

    const handleQuestionRangeChange = (e, index) => {
        const newRange = [...questionRange];
        newRange[index] = parseInt(e.target.value);
        setQuestionRange(newRange);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        setSelectedDifficulties([]);
        setQuestionRange([0, maxQuestions]);
        setCurrentPage(1);
    };

    const activeFilterCount = [
        selectedCategories.length, 
        selectedDifficulties.length, 
        questionRange[0] > 0 || questionRange[1] < maxQuestions ? 1 : 0
    ].filter(Boolean).length;

    // Show a loading state while fetching data
    if (loading) {
        return (
            <div className="quiz-app-container">
                <div className="quiz-container">
                    <div className="loading-message">Loading quizzes...</div>
                </div>
            </div>
        );
    }

    // Show an error state if fetch failed
    if (error) {
        return (
            <div className="quiz-app-container">
                <div className="quiz-container">
                    <div className="error-message">
                        <h3>Error loading quizzes</h3>
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
                    {/* Search and Filter Controls */}
                    <div className="controls-container">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search quizzes by name..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="search-input"
                            />
                            {(searchTerm || activeFilterCount > 0) && (
                                <button onClick={resetFilters} className="clear-search-button">
                                    Reset All
                                </button>
                            )}
                        </div>

                        <div className="action-buttons">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                                {activeFilterCount > 0 && (
                                    <span className="filter-count">{activeFilterCount}</span>
                                )}
                            </button>

                            <button 
                                onClick={onAddQuizClick}
                                className="add-quiz-button"
                            >
                                + Add Quiz
                            </button>
                        </div>
                    </div>

                    {/* Collapsible Filter Section */}
                    {showFilters && (
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

                            <div className="filter-group">
                                <h3 className="filter-title">Questions: {questionRange[0]} - {questionRange[1]}</h3>
                                <div className="range-slider">
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxQuestions}
                                        value={questionRange[0]}
                                        onChange={(e) => handleQuestionRangeChange(e, 0)}
                                        className="range-input"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxQuestions}
                                        value={questionRange[1]}
                                        onChange={(e) => handleQuestionRangeChange(e, 1)}
                                        className="range-input"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Info */}
                    <div className="results-info">
                        <span className="results-count">
                            Showing {filteredQuizzes.length} of {allQuizzes.length} quizzes
                        </span>
                        {activeFilterCount > 0 && (
                            <button onClick={resetFilters} className="clear-filters-button">
                                Clear filters
                            </button>
                        )}
                    </div>

                    {/* Quiz Grid */}
                    {filteredQuizzes.length === 0 ? (
                        <div className="no-results-message">
                            No quizzes found matching your criteria. Try adjusting your filters.
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
                                                        <span>{quiz.questionsCount} Questions</span>
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

                            {/* Pagination */}
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