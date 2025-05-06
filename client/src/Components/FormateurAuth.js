import React, { useEffect, useState } from 'react';
import { getStoredFormateur, loginFormateur, registerFormateur } from '../services/formateurService';
import FormateurDashboard from './FormateurDashboard';
import "../Styles/formateurauth.css";
import { useNavigate } from 'react-router-dom';


const FormateurAuth = () => {
  const [formateur, setFormateur] = useState(null);
  const [form, setForm] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = getStoredFormateur();
    if (stored) setFormateur(stored);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      console.log("Trying to login with:", formData);
      const result = await loginFormateur({ email: formData.email, mot_de_passe: formData.password });
      console.log("Login result:", result);
      if (result.user) {
        setFormateur(result.user);
        navigate('/formateur/dashboard');
      } else {
        alert('Utilisateur ou mot de passe invalide');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      alert('Erreur de connexion');
    }
  };

  const handleRegister = async () => {
    try {
      console.log("Trying to register with:", formData);
      const result = await registerFormateur({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log("Register result:", result);
      if (result.user) {
        setFormateur(result.user);
      } else {
        alert("Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      alert('Erreur d\'inscription');
    }
  };


  return (
    <div style={{height:'80.9vh'}}>
    <div className="formateur-auth-container">
      <h2>{form === 'login' ? 'Connexion Formateur' : 'Inscription Formateur'}</h2>
      {form === 'register' && (
        <input type="text" name="name" placeholder="Nom" onChange={handleChange} />
      )}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
      <button onClick={form === 'login' ? handleLogin : handleRegister}>
        {form === 'login' ? 'Se connecter' : 'S’inscrire'}
      </button>
      <p onClick={() => setForm(form === 'login' ? 'register' : 'login')} style={{ cursor: 'pointer', color: '#007bff' }}>
        {form === 'login' ? 'Créer un compte' : 'Déjà inscrit ? Se connecter'}
      </p>
    </div>
    </div>
  );
};

export default FormateurAuth;
