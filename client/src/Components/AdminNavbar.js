import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/AdminNavbar.css'; 

const AdminNavbar = () => {
    const navigate = useNavigate();
    const [pendingRequests, setPendingRequests] = useState(0);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await axios.get('http://localhost:3002/api/verification/requests', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const pending = response.data.filter(req => req.status === 'en attente').length;
                setPendingRequests(pending);
            } catch (error) {
                console.error("Error fetching pending requests", error);
            }
        };

        fetchPendingRequests();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    return (
        <div className="admin-sidebar">
            <h3 className="sidebar-title">Admin Panel</h3>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link to="/admin/users">Gérer les utilisateurs</Link>
                </li>
                <li>
                    <Link to="/admin/quizzes">Gérer les quizzes</Link>
                </li>
                <li>
                    <Link to="/admin/scores">Scores des utilisateurs</Link>
                </li>
                <li>
                    <Link to="/admin/export">Exporter les scores</Link>
                </li>
                <li>
                    <Link to="/admin/verification-requests">
                        Demandes de vérification
                        {pendingRequests > 0 && (
                            <span className="notification-badge">{pendingRequests}</span>
                        )}
                    </Link>
                </li>
            </ul>
            <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
        </div>
    );
};

export default AdminNavbar;
