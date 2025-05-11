import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../Styles/feedback.css';
import { submitFeedback } from '../services/feedbackService';
import happy from "../assets/happy.jpg";
import veryhappy from "../assets/veryhappy.jpg";
import neutre from "../assets/neutre.jpg";
import sad from "../assets/sad.jpg";
import verysad from "../assets/versad.jpg";

const FeedbackPopup = ({ show, quizId, userId, onClose }) => {
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const emojiOptions = [
        { image: verysad, value: 'very_negative', label: 'Terrible', className: 'emoji-very-bad', text: "Je n'ai vraiment pas aimé ce quiz." },
        { image: sad, value: 'negative', label: 'Mauvais', className: 'emoji-bad', text: "Le quiz n'était pas génial. Je ne l'ai pas apprécié." },
        { image: neutre, value: 'neutral', label: 'Neutre', className: 'emoji-neutral', text: "Le quiz était moyen. Pas trop mauvais, pas trop bon." },
        { image: happy, value: 'positive', label: 'Bon', className: 'emoji-good', text: "J'ai aimé le quiz. C'était bien." },
        { image: veryhappy, value: 'very_positive', label: 'Excellent', className: 'emoji-amazing', text: "J'ai adoré ce quiz ! C'était incroyable et amusant !" }
    ];

    const handleFeedbackSubmit = async () => {
        if (!selectedEmoji) return;

        try {
            const selectedOption = emojiOptions.find(option => option.value === selectedEmoji);
            const response = await submitFeedback(userId, quizId, selectedOption.text);

            if (response.success) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setSelectedEmoji(null);
                    setErrorMessage("");
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setErrorMessage("Une erreur s'est produite lors de l'envoi du feedback. Veuillez réessayer.");
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="feedback-popup-title">Comment était ce quiz ?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="feedback-popup-container">
                    {emojiOptions.map((emoji) => (
                        <button
                            key={emoji.value}
                            className={`feedback-popup-button ${selectedEmoji === emoji.value ? 'feedback-popup-button-selected' : ''}`}
                            onClick={() => setSelectedEmoji(emoji.value)}
                        >
                            <img 
                                src={emoji.image} 
                                alt={emoji.label} 
                                className="feedback-popup-image" 
                            />
                            <div className="feedback-popup-label">{emoji.label}</div>
                        </button>
                    ))}
                </div>
                {errorMessage && <div className="feedback-error">{errorMessage}</div>}
            </Modal.Body>
            <Modal.Footer className="feedback-popup-footer">
                <Button variant="secondary" onClick={onClose} className="feedback-close-btn">
                    Fermer
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleFeedbackSubmit} 
                    disabled={!selectedEmoji || submitted}
                    className="feedback-submit-btn"
                >
                    {submitted ? "Merci !" : "Envoyer"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FeedbackPopup;
