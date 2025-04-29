import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiService';
import '../Styles/MyProfile.css';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const { password, ...updates } = formData;
      const updateData = password ? formData : updates;

      const response = await apiClient.put(`/api/update/${user.username}`, updateData);

      if (response.message) {
        setSuccessMessage('Profil mis à jour avec succès!');
        const updatedUser = { ...user, name: formData.name, email: formData.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditMode(false);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) return;
    try {
      await apiClient.delete(`/api/delete/${user.username}`);
      logout();
      navigate('/');
      window.alert("Votre compte a été supprimé avec succès.");
    } catch (error) {
      window.alert("Erreur lors de la suppression du compte: " + (error.message || 'Erreur serveur'));
    }
  };

  if (loading) return <div className="profile-loading">Chargement...</div>;

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Vous êtes déconnecté(e)</h2>
          <p>Veuillez vous reconnecter pour accéder à votre profil.</p>
          <button className="profile-btn" onClick={() => navigate('/')}>Accueil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Mon Profil</h2>
      <div className="profile-card">
        {!editMode ? (
          <div className="profile-info">
            <p><strong>Nom:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Score:</strong> {user.score || 0}</p>
            <p><strong>Rôle:</strong> {user.role}</p>
            <div className="profile-actions">
              <button className="profile-btn edit-btn" onClick={() => setEditMode(true)}>Modifier mes infos</button>
              <button className="profile-btn delete-btn" onClick={handleDeleteAccount}>Supprimer mon compte</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="profile-form">
            <label>Nom complet:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Nouveau mot de passe (laisser vide si inchangé):</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />

            <div className="form-buttons">
              <button type="submit" className="profile-btn save-btn" disabled={saving}>
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </button>
              <button 
                type="button" 
                className="profile-btn cancel-btn" 
                onClick={() => {
                  setFormData({ name: user.name, email: user.email, password: '' });
                  setEditMode(false);
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {successMessage && <div className="profile-success">{successMessage}</div>}
        {errorMessage && <div className="profile-error">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default MyProfile;
