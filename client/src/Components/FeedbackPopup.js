import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import '../Styles/feedback.css';
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
        { image: verysad, value: 'very bad', label: 'Très Mauvais', text: "C'était horrible, je n'ai pas du tout aimé ce quiz." },
        { image: sad, value: 'bad', label: 'Mauvais', text: "Le quiz n'était pas très bon, je ne l'ai pas apprécié." },
        { image: neutre, value: 'neutral', label: 'Neutre', text: "Le quiz était moyen. Pas trop mauvais, pas trop bon." },
        { image: happy, value: 'good', label: 'Bon', text: "J'ai aimé le quiz. C'était bien." },
        { image: veryhappy, value: 'very good', label: 'Excellent', text: "J'ai adoré ce quiz ! C'était incroyable et amusant !" }
    ];

    const handleFeedbackSubmit = async () => {
        if (!selectedEmoji) return;

        try {
            const selectedOption = emojiOptions.find(option => option.value === selectedEmoji);

            // Direct backend call without feedbackService
            const response = await axios.post('http://localhost:3002/api/feedback', {
                user_id: userId,
                quiz_id: quizId,
                feedback_text: selectedOption.text
            });

            if (response.data.success) {
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
