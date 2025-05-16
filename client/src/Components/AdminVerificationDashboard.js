import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminVerificationDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('http://localhost:3002/api/verification/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
        } catch (error) {
            console.error(error);
            setError('Erreur lors du chargement des demandes de vérification.');
        }
    };

    const handleDecision = async (requestId, status) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.put(
                `http://localhost:3002/api/verification/decision/${requestId}`,
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMessage(response.data.message);
            setRequests(requests.filter(request => request.id !== requestId));
        } catch (error) {
            console.error(error);
            setError("Erreur lors de la mise à jour de la demande.");
        }
    };

    return (
        <div className="verification-dashboard" style={{ padding: '2rem' }}>
            <h2>Demandes de Vérification</h2>
            
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {requests.length === 0 ? (
                <p>Aucune demande de vérification en attente.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ID Formateur</th>
                            <th>Date de Demande</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{request.formateur_id}</td>
                                <td>{new Date(request.created_at).toLocaleDateString()}</td>
                                <td>{request.status}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleDecision(request.id, 'accepté')}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Accepter
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDecision(request.id, 'refusé')}
                                    >
                                        Refuser
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminVerificationDashboard;
