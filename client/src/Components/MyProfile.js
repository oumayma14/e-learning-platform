import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import "../Styles/MyProfile.css";

const MyProfile = () => {
  const { user, setUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    score: user?.score || 0
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.updateUser(user.username, formData);
      setUser(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Échec de la mise à jour du profil. Veuillez réessayer.');
    }
  };

  const handleDelete = async () => {
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'fullscreen-dialog';
    
    confirmDialog.innerHTML = `
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>Confirmation requise</h3>
        </div>
        <div class="dialog-body">
          <p>Êtes-vous certain de vouloir supprimer définitivement votre compte ? Cette action est irréversible et toutes vos données seront perdues.</p>
        </div>
        <div class="dialog-footer">
          <button class="cancel-btn">
            Annuler
          </button>
          <button class="confirm-btn">
            Confirmer
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(confirmDialog);
    
    const cancelBtn = confirmDialog.querySelector('.cancel-btn');
    const confirmBtn = confirmDialog.querySelector('.confirm-btn');
    
    const closeDialog = () => {
      confirmDialog.remove();
    };
    
    cancelBtn.addEventListener('click', closeDialog);
    
    confirmBtn.addEventListener('click', async () => {
      try {
        await apiService.deleteUser(user.username);
        closeDialog();
        logout();
      } catch (err) {
        setError('Échec de la suppression du compte. Veuillez réessayer.');
        closeDialog();
      }
    });
  };

  if (!user) return <div className="profile-container">Veuillez vous connecter pour voir votre profil</div>;

  return (
    <div className="profile-container">
      <h2>Votre Profil</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="score-display">
        Votre score actuel : <span className="score-value">{user.score} points</span>
      </div>
      
      {!isEditing ? (
        <div className="profile-info">
          <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
          <p><strong>Nom :</strong> {user.name}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> {user.role}</p>
          
          <div className="profile-actions">
            <button 
              onClick={() => setIsEditing(true)} 
              className="primary"
            >
              Modifier le profil
            </button>
            <button 
              onClick={handleDelete} 
              className="delete-btn"
            >
              Supprimer le compte
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="edit-form">
          <label>
            Nom :
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          
          <label>
            Email :
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          
          <label>
            Nouveau mot de passe (laisser vide pour ne pas changer) :
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              minLength="6"
            />
          </label>
          
          <label>
            Score :
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              min="0"
            />
          </label>
          
          <div className="form-actions">
            <button type="submit" className="primary">
              Enregistrer
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsEditing(false);
                setError('');
              }} 
              className="secondary"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MyProfile;