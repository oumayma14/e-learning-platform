import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FormateurProfile = () => {
    const [formateur, setFormateur] = useState({
        id: '',
        nom: '',
        email: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');

    useEffect(() => {
        const formateurData = JSON.parse(localStorage.getItem('formateurUser'));
        
        if (formateurData && formateurData.id) {
            setFormateur({
                id: formateurData.id,
                nom: formateurData.nom,
                email: formateurData.email,
            });
            fetchProfile(formateurData.id);
            fetchVerificationStatus(formateurData.id);
        }
    }, []);

    const fetchProfile = async (formateurId) => {
        try {
            const token = localStorage.getItem('formateur_token');
            const response = await axios.get(`http://localhost:3002/api/formateur/${formateurId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const { id, nom, email } = response.data;
            setFormateur({ id, nom, email });
        } catch (error) {
            console.error(error);
            setError("Erreur lors du chargement du profil.");
        }
    };

    const fetchVerificationStatus = async (formateurId) => {
        try {
            const response = await axios.get(`http://localhost:3002/api/verification/status/${formateurId}`);
            setVerificationStatus(response.data.status || 'non vérifié');
        } catch (error) {
            console.error(error);
            setVerificationStatus('non vérifié');
        }
    };

    const handleVerificationRequest = async () => {
        try {
            const response = await axios.post(`http://localhost:3002/api/verification/request`, {
                formateur_id: formateur.id,
            });
            setMessage('Demande de vérification envoyée avec succès.');
            setVerificationStatus('en attente');
        } catch (error) {
            console.error(error);
            setError("Erreur lors de l'envoi de la demande de vérification.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormateur({ ...formateur, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('formateur_token');
            await axios.put(`http://localhost:3002/api/formateur/${formateur.id}`, {
                nom: formateur.nom,
                email: formateur.email,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage("Profil mis à jour avec succès !");
            setError('');
        } catch (error) {
            console.error(error);
            setError("Erreur lors de la mise à jour du profil.");
        }
    };

    return (
        <div className="profile-container">
            <h2>Mon Profil</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nom</label>
                    <input
                        type="text"
                        name="nom"
                        value={formateur.nom}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formateur.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Mettre à jour</button>
            </form>

            <div className="verification-container" style={{ marginTop: '2rem' }}>
                <h3>Statut de vérification : <span style={{ color: verificationStatus === 'accepté' ? 'green' : verificationStatus === 'en attente' ? 'orange' : 'red' }}>{verificationStatus}</span></h3>
                
                {verificationStatus === 'non vérifié' && (
                    <button
                        onClick={handleVerificationRequest}
                        className="btn btn-warning"
                        style={{ marginTop: '1rem' }}
                    >
                        Demander la vérification
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormateurProfile;
