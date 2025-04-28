import React from 'react';
import '../Styles/ChallengeModal.css';

const ChallengeModal = ({ show, onClose, challengeCode }) => {
  if (!show) return null;

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(challengeCode)
        .then(() => alert('✅ Code copié dans le presse-papiers ! 📋'))
        .catch(() => alert('❌ Échec de la copie'));
    } else {
      alert('❌ Clipboard non supporté');
    }
  };

  return (
    <div className="challenge-modal-overlay">
      <div className="challenge-modal-content">
        <h2>🎯 Défi prêt !</h2>
        <p className="challenge-code">{challengeCode}</p>
        <div className="challenge-buttons">
          <button onClick={handleCopyCode} className="copy-btn">📋 Copier</button>
          <button onClick={onClose} className="close-btn">❌ Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
