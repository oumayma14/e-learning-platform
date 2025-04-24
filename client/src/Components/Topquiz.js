import { useState, useEffect } from "react";
import { QUIZ_API_URL } from '../services/quizService';
import Slider from "react-slick";
import "../Styles/Topquiz.css";
import { Link } from "react-router-dom";

export const Topquiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const response = await fetch(QUIZ_API_URL);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                }

                const result = await response.json();

                if (result.success && result.data) {
                    const quizzes = result.data.map(quiz => ({
                        id: quiz.id,
                        title: quiz.title,
                        description: quiz.description,
                        difficulty: quiz.difficulty,
                        category: quiz.category,
                        featured: Math.random() > 0.8 // 20% chance d’être en vedette
                    }));

                    setQuizzes(quizzes);
                } else {
                    throw new Error(result.message || 'Échec du chargement des quiz');
                }
            } catch (err) {
                console.error('Erreur de chargement des quiz :', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const ReadMore = ({ text = "", maxLength = 80 }) => {
        const [isReadMore, setIsReadMore] = useState(true);

        const toggleReadMore = () => {
            setIsReadMore(!isReadMore);
        };

        return (
            <p className="card-description">
                {isReadMore ? text.slice(0, maxLength) + (text.length > maxLength ? "..." : "") : text}
                {text.length > maxLength && (
                    <span onClick={toggleReadMore} className="read-more-btn">
                        {isReadMore ? " Voir Plus" : " Voir Moins"}
                    </span>
                )}
            </p>
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    if (loading) {
        return (
            <section className="quiz">
                <div className="cont">
                    <div className="loading">
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="quiz">
                <div className="cont">
                    <div className="error">Erreur lors du chargement des quiz : {error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className="quiz">
            <div className="cont">
                <div className="section-header">
                    <h2>Découvrez Nos Quiz</h2>
                    <p>Testez vos connaissances avec nos quiz interactifs</p>
                </div>
                <div className="topquiz">
                    {quizzes.length > 0 ? (
                        <Slider {...settings}>
                            {quizzes.map((quiz) => (
                                <div key={quiz.id} className={`card ${quiz.featured ? 'featured' : ''}`}>
                                    <div className="card-body">
                                        <div className={`quiz-badge ${quiz.category.replace(/\s+/g, '-').toLowerCase()}`}>
                                            {quiz.category}
                                        </div>
                                        <h3 className="card-title">{quiz.title}</h3>
                                        <ReadMore text={quiz.description} maxLength={90} />
                                        <div className="quiz-meta">
                                            <span className={`difficulty difficulty-${quiz.difficulty.toLowerCase()}`}>
                                                {quiz.difficulty}
                                            </span>
                                        </div>
                                        <Link 
                                            to={`quiz/${quiz.id}`} 
                                            className="quiz-button"
                                            aria-label={`Commencer le quiz ${quiz.title}`}
                                        >
                                            Commencer le Quiz
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="no-quizzes">
                            Aucun quiz disponible pour le moment. Revenez plus tard !
                        </div>
                    )} 
                </div>
            </div>
        </section>
    );
};
