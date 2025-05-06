import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutFormateur } from '../services/formateurService';
import '../Styles/FormateurNavbar.css'; 

const FormateurNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutFormateur();
    localStorage.removeItem('formateurUser'); 
    navigate('/formateur');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/formateur/dashboard">Formateur</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#formateurNavbar">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="formateurNavbar">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/formateur/dashboard">Accueil</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/formateur/dashboard/add-quiz">Créer un Quiz</Link>
          </li>
        </ul>
        <button className="btn btn-outline-light" onClick={handleLogout}>Déconnexion</button>
      </div>
    </nav>
  );
};

export default FormateurNavbar;
