import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../Styles/MainQuiz.css";

export default function MainQuiz({ onAddQuizClick }) {
    // Quiz data - moved to state so we can update it
    const [allQuizzes, setAllQuizzes] = useState([
        { id: 1, title: "JavaScript Basics", description: "Fundamental JS concepts", questionsCount: 10, difficulty: "Beginner", category: "Programming" },
        { id: 2, title: "React Advanced", description: "Hooks and performance", questionsCount: 15, difficulty: "Advanced", category: "Web Dev" },
        { id: 3, title: "CSS Mastery", description: "Flexbox and Grid", questionsCount: 12, difficulty: "Intermediate", category: "Web Dev" },
        { id: 4, title: "TypeScript", description: "Type systems", questionsCount: 10, difficulty: "Intermediate", category: "Programming" },
        { id: 5, title: "Python", description: "Syntax basics", questionsCount: 8, difficulty: "Beginner", category: "Programming" },
        { id: 6, title: "Node.js", description: "Server-side JS", questionsCount: 14, difficulty: "Intermediate", category: "Web Dev" },
        { id: 7, title: "Data Structures", description: "Arrays, Lists", questionsCount: 20, difficulty: "Advanced", category: "CS" },
        { id: 8, title: "Algorithms", description: "Sorting", questionsCount: 18, difficulty: "Advanced", category: "CS" },
        { id: 9, title: "HTML5", description: "Modern elements", questionsCount: 10, difficulty: "Beginner", category: "Web Dev" },
        { id: 10, title: "Databases", description: "SQL/NoSQL", questionsCount: 12, difficulty: "Intermediate", category: "CS" },
        { id: 11, title: "Git", description: "Version control", questionsCount: 10, difficulty: "Intermediate", category: "Tools" },
        { id: 12, title: "Docker", description: "Containers", questionsCount: 8, difficulty: "Intermediate", category: "DevOps" },
        { id: 13, title: "AWS", description: "Cloud services", questionsCount: 12, difficulty: "Intermediate", category: "Cloud" },
        { id: 14, title: "ML Basics", description: "AI concepts", questionsCount: 15, difficulty: "Advanced", category: "AI" },
        { id: 15, title: "Security", description: "Web protection", questionsCount: 10, difficulty: "Intermediate", category: "Security" },
        { id: 16, title: "API Design", description: "REST principles", questionsCount: 8, difficulty: "Intermediate", category: "Web Dev" },
        { id: 17, title: "GraphQL", description: "Query language", questionsCount: 10, difficulty: "Intermediate", category: "Web Dev" },
        { id: 18, title: "Redux", description: "State management", questionsCount: 12, difficulty: "Intermediate", category: "Web Dev" },
    ]);

    // Get all unique categories and difficulties
    const allCategories = [...new Set(allQuizzes.map(quiz => quiz.category))];
    const allDifficulties = [...new Set(allQuizzes.map(quiz => quiz.difficulty))];
    const maxQuestions = Math.max(...allQuizzes.map(quiz => quiz.questionsCount));

    // State management
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [questionRange, setQuestionRange] = useState([0, maxQuestions]);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const quizzesPerPage = 6;

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